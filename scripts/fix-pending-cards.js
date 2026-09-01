/**
 * Elimina tarjetas (<a class="hosteria-card">) de propiedades pending_verification
 * en páginas públicas de listado. Las propiedades pending son:
 *   - hosteria-real
 *   - hosteria-bohios-bar
 *   - hosteria-paraiso-santa-fe
 *   - finca-hotel-tropical-palser
 *
 * Ejecutar: node scripts/fix-pending-cards.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Slugs de propiedades pendientes de verificación
const PENDING_SLUGS = [
  'hosteria-real',
  'hosteria-bohios-bar',
  'hosteria-paraiso-santa-fe',
  'finca-hotel-tropical-palser',
];

// Páginas públicas donde pueden aparecer estas tarjetas (no sus propias páginas)
const TARGET_FILES = [
  'hosterias.html',
  'dia-de-sol.html',
  'hoteles.html',
  'index.html',
  'hosterias-para-parejas-santa-fe-de-antioquia.html',
  'hoteles-con-piscina-santa-fe-de-antioquia.html',
  'hoteles-para-familias-santa-fe-de-antioquia.html',
  'blog-dia-de-sol-medellin.html',
  'blog-hosterias-parejas.html',
  'blog-hosterias-economicas.html',
];

/**
 * Elimina un bloque <a class="hosteria-card" href="/SLUG" ...>...</a>
 * del HTML. Busca la apertura del tag y elimina hasta el </a> de cierre correspondiente.
 */
function removePendingCards(html, slug) {
  // Patrón para encontrar la apertura de la tarjeta con el slug pendiente
  const openTagRe = new RegExp(
    `\\s*<a\\s[^>]*class="[^"]*hosteria-card[^"]*"[^>]*href="/${slug}"[^>]*>`,
    'g'
  );

  let result = html;
  let match;

  while ((match = openTagRe.exec(result)) !== null) {
    const start = match.index;
    // Encontrar el </a> de cierre correspondiente (puede haber <a> anidados dentro? No en este caso)
    // Buscar el primer </a> después del inicio de la card
    const afterOpen = start + match[0].length;
    const closeTag = '</a>';
    const closeIdx = result.indexOf(closeTag, afterOpen);
    if (closeIdx === -1) continue;
    const end = closeIdx + closeTag.length;

    // Eliminar el bloque completo incluyendo whitespace antes
    result = result.slice(0, start) + result.slice(end);
    // Resetear la búsqueda desde el inicio (el índice cambió)
    openTagRe.lastIndex = 0;
  }

  return result;
}

let totalRemoved = 0;

for (const fileName of TARGET_FILES) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  let removedInFile = 0;

  for (const slug of PENDING_SLUGS) {
    // Cuenta ocurrencias antes
    const countBefore = (html.match(new RegExp(`href="/${slug}"`, 'g')) || []).length;
    html = removePendingCards(html, slug);
    const countAfter = (html.match(new RegExp(`href="/${slug}"`, 'g')) || []).length;
    const removed = countBefore - countAfter;
    if (removed > 0) {
      console.log(`  - ${fileName}: eliminadas ${removed} tarjeta(s) de /${slug}`);
      removedInFile += removed;
    }
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    totalRemoved += removedInFile;
  }
}

// Verificar que no quedaron referencias en páginas públicas relevantes
console.log('\n--- Verificación ---');
for (const fileName of TARGET_FILES) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  for (const slug of PENDING_SLUGS) {
    const count = (html.match(new RegExp(`href="/${slug}"`, 'g')) || []).length;
    if (count > 0) {
      console.warn(`⚠️  ${fileName} aún tiene ${count} referencia(s) a /${slug}`);
    }
  }
}

console.log(`\nListo: ${totalRemoved} tarjeta(s) de propiedades pendientes eliminadas.`);
