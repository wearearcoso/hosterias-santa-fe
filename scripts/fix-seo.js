#!/usr/bin/env node
/**
 * Sprint 6 — SEO fixes:
 * 1. Replace hosteriassantafe.com canonicals → hosterias-santa-fe.pages.dev
 * 2. Remove .html from canonical URLs
 * 3. Add noindex to blog, legal, redirect, old listing pages
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Pages that need noindex added (if they don't already have it)
const NOINDEX_PAGES = new Set([
  'blog-dia-de-sol-medellin.html',
  'blog-hosterias-economicas.html',
  'blog-hosterias-parejas.html',
  'blog.html',
  'contacto.html',
  'dia-de-sol.html',
  'habeas-data.html',
  'hosterias.html',
  'hoteles.html',
  'politica-privacidad.html',
  'servicios.html',
  'terminos.html',
  'tour-detalle.html',
]);

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let fixedFiles = 0;

for (const file of files) {
  const filepath = path.join(ROOT, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // Fix canonical: hosteriassantafe.com → hosterias-santa-fe.pages.dev + remove .html
  const original = content;
  content = content.replace(
    /https:\/\/hosteriassantafe\.com\/([a-z0-9-]+)(?:\.html)?/g,
    'https://hosterias-santa-fe.pages.dev/$1'
  );
  if (content !== original) changed = true;

  // Add noindex if needed and not already present
  if (NOINDEX_PAGES.has(file) && !content.includes('noindex')) {
    content = content.replace(
      /(<head[^>]*>)/i,
      '$1\n  <meta name="robots" content="noindex, nofollow">'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  ✓ ${file}`);
    fixedFiles++;
  }
}

console.log(`\nFixed ${fixedFiles} files`);
