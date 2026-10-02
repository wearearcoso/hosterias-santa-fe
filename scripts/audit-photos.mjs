#!/usr/bin/env node
// Audit images referenced by the public routes in sitemap.xml.
// A local file or a public URL is never evidence of permission to publish it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gate = process.argv.includes('--launch-gate');
const json = process.argv.includes('--json');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const rights = JSON.parse(fs.readFileSync(path.join(root, 'src/data/image-rights.json'), 'utf8'));
const rightsByFile = new Map(rights.images.map(record => [record.file, record]));
const sitemapPages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => {
  const pathname = new URL(url).pathname.replace(/\/$/, '');
  return pathname ? pathname.slice(1) + '.html' : 'index.html';
});
const pages = [...new Set([...sitemapPages, 'politica-privacidad.html', 'terminos.html', 'habeas-data.html'])];

const used = new Map();
const missingPages = [];
const weakAlt = [];
for (const page of pages) {
  const htmlPath = path.join(root, page);
  if (!fs.existsSync(htmlPath)) { missingPages.push(page); continue; }
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const [, fileName] of html.matchAll(/assets\/images\/([^\s"'<>),?]+)/g)) {
    const file = 'assets/images/' + decodeURIComponent(fileName);
    if (!used.has(file)) used.set(file, new Set());
    used.get(file).add(page);
  }
  for (const [, tag] of html.matchAll(/<img\b([^>]+)>/gi)) {
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
    if (!src.includes('assets/images/')) continue;
    const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1];
    if (alt === undefined || /^\s*(?:foto\s*\d+|imagen(?: de referencia)?(?: de| del)? .*)\s*$/i.test(alt)) {
      weakAlt.push({ page, src, alt: alt ?? null });
    }
  }
}

const files = [...used].map(([file, pageSet]) => {
  const record = rightsByFile.get(file);
  const exists = fs.existsSync(path.join(root, file));
  const authorized = Boolean(record?.status === 'authorized' && record.rightsHolder &&
    record.authorizationType && record.evidenceDocument && record.authorizedAt &&
    (!record.property || (record.identityVerified === true && record.identityEvidenceDocument)));
  return { file, pages: [...pageSet].sort(), exists, rightsStatus: record?.status ?? 'unregistered',
    identityVerified: record?.property ? record.identityVerified === true : null,
    publishable: authorized };
}).sort((a, b) => a.file.localeCompare(b.file));

const summary = {
  pages: pages.length,
  images: files.length,
  missingPages,
  missingFiles: files.filter(item => !item.exists),
  rightsPending: files.filter(item => !item.publishable),
  weakAlt,
  launchReady: missingPages.length === 0 && weakAlt.length === 0 && files.every(item => item.exists && item.publishable)
};
if (json) console.log(JSON.stringify({ summary, files }, null, 2));
else {
  console.log('Pages: ' + summary.pages + '; referenced photos: ' + summary.images +
    '; missing files: ' + summary.missingFiles.length +
    '; photos without documented permission: ' + summary.rightsPending.length +
    '; weak alt: ' + summary.weakAlt.length);
  for (const item of summary.missingFiles) console.log('MISSING ' + item.file + ' (' + item.pages.join(', ') + ')');
  for (const item of summary.rightsPending) console.log('RIGHTS ' + item.rightsStatus + ' ' + item.file);
  for (const item of summary.weakAlt) console.log('ALT ' + item.page + ': ' + item.src + ' => ' + JSON.stringify(item.alt));
  console.log(summary.launchReady ? 'Photo launch gate: PASS' : 'Photo launch gate: BLOCKED');
}
if (gate && !summary.launchReady) process.exitCode = 1;
