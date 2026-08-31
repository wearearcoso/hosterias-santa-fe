#!/usr/bin/env node
/**
 * Reemplaza todos los href="slug.html" → href="/slug" en los archivos HTML.
 * href="index.html" → href="/"
 * No toca URLs externas, mailto:, #anchors, ni rutas de assets.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const files = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(ROOT, f));

// Construir mapa desde nombre de archivo → URL limpia
const urlMap = {};
for (const file of files) {
  const base = path.basename(file, '.html');
  urlMap[`${base}.html`] = base === 'index' ? '/' : `/${base}`;
}

let totalFiles = 0;
let totalLinks = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let count = 0;

  const updated = original.replace(
    /href="([a-z0-9][a-z0-9-]*\.html)([^"]*)"/g,
    (match, filename, extra) => {
      const clean = urlMap[filename];
      if (!clean) return match;
      count++;
      return `href="${clean}${extra}"`;
    }
  );

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`  ✓ ${path.basename(file)} — ${count} enlace(s)`);
    totalFiles++;
    totalLinks += count;
  }
}

console.log(`\nListo: ${totalLinks} enlaces actualizados en ${totalFiles} archivos`);
