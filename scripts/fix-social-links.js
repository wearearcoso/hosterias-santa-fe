/**
 * Oculta los íconos de redes sociales con href="#" en todos los archivos HTML.
 * Las URLs reales no están disponibles aún — se muestran como "disponible próximamente".
 * Ejecutar: node scripts/fix-social-links.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(ROOT, f));

let modified = 0;

for (const filePath of HTML_FILES) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Ocultar contenedor de sociales en top bar
  const topBarBefore = html;
  html = html.replace(
    /<div class="top-bar-socials">([\s\S]*?)<\/div>/g,
    '<div class="top-bar-socials" aria-hidden="true" style="display:none">$1</div>'
  );
  if (html !== topBarBefore) changed = true;

  // Ocultar contenedor de sociales en header
  const headerBefore = html;
  html = html.replace(
    /<div class="header-socials"((?!style)[^>]*)>/g,
    '<div class="header-socials"$1 aria-hidden="true" style="display:none">'
  );
  if (html !== headerBefore) changed = true;

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    modified++;
    console.log(`✓ ${path.basename(filePath)}`);
  }
}

console.log(`\nListo: ${modified} archivos actualizados.`);
