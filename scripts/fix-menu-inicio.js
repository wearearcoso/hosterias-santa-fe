/**
 * 1. Agrega "Inicio" como primer ítem del menú en todos los archivos HTML.
 * 2. Reemplaza enlace a Hostería Real (pending) en la nav por El Castellano (verified).
 * 3. Agrega aria-current="page" al enlace Inicio solo en index.html.
 *
 * Ejecutar: node scripts/fix-menu-inicio.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HTML_FILES = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(ROOT, f));

// Bloque "Inicio" que se inserta antes del primer .menu-group con trigger de Hosterías
const INICIO_BLOCK = `<div class="menu-group">
        <a href="/" class="menu-top-link" style="display:flex;align-items:center;gap:.75rem;padding:var(--space-sm) 0;font-size:var(--body-lg);font-weight:500;color:var(--mine-shaft);">
          <svg class="compass-icon" viewBox="0 0 68 68" fill="none" style="width:24px;height:24px;flex-shrink:0;"><circle cx="34" cy="34" r="31" stroke="#F5C800" stroke-width="1.5"/><path d="M34 7 L29.5 30 L34 27 L38.5 30 Z" fill="#F5C800"/><path d="M34 61 L38.5 38 L34 41 L29.5 38 Z" fill="#F5C800" opacity=".4"/><path d="M7 34 L30 38.5 L27 34 L30 29.5 Z" fill="#F5C800" opacity=".4"/><path d="M61 34 L38 29.5 L41 34 L38 38.5 Z" fill="#F5C800"/><circle cx="34" cy="34" r="4" fill="#F5C800"/></svg>
          Inicio
        </a>
      </div>

      `;

const INICIO_BLOCK_HOME = `<div class="menu-group">
        <a href="/" class="menu-top-link" aria-current="page" style="display:flex;align-items:center;gap:.75rem;padding:var(--space-sm) 0;font-size:var(--body-lg);font-weight:500;color:var(--mine-shaft);">
          <svg class="compass-icon" viewBox="0 0 68 68" fill="none" style="width:24px;height:24px;flex-shrink:0;"><circle cx="34" cy="34" r="31" stroke="#F5C800" stroke-width="1.5"/><path d="M34 7 L29.5 30 L34 27 L38.5 30 Z" fill="#F5C800"/><path d="M34 61 L38.5 38 L34 41 L29.5 38 Z" fill="#F5C800" opacity=".4"/><path d="M7 34 L30 38.5 L27 34 L30 29.5 Z" fill="#F5C800" opacity=".4"/><path d="M61 34 L38 29.5 L41 34 L38 38.5 Z" fill="#F5C800"/><circle cx="34" cy="34" r="4" fill="#F5C800"/></svg>
          Inicio
        </a>
      </div>

      `;

// Marcador para detectar dónde insertar (el primer grupo del nav que tiene "Hosterías")
// Coincide con la apertura del primer <div class="menu-group"> que contiene el trigger de Hosterías
const NAV_ANCHOR_RE = /(<div class="menu-nav">\s+)(<div class="menu-group">)/;

// En el nav, reemplazar el enlace a Hostería Real (pending) por El Castellano (verified)
const REAL_NAV_LINK = '<a href="/hosteria-real">Hostería Real</a>';
const CASTELLANO_NAV_LINK = '<a href="/hosteria-el-castellano">Hostería El Castellano</a>';

let modified = 0;
let skipped = 0;

for (const filePath of HTML_FILES) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const isHome = path.basename(filePath) === 'index.html';

  // 1. Insertar Inicio si aún no existe
  if (!html.includes('class="menu-top-link"')) {
    const inicioBlock = isHome ? INICIO_BLOCK_HOME : INICIO_BLOCK;
    if (NAV_ANCHOR_RE.test(html)) {
      html = html.replace(NAV_ANCHOR_RE, `$1${inicioBlock}$2`);
      changed = true;
    } else {
      console.warn(`⚠️  No se encontró anchor de nav en ${path.basename(filePath)}`);
    }
  }

  // 2. Reemplazar Hostería Real en nav por El Castellano (solo en contexto de nav)
  // Para evitar afectar tarjetas de contenido, solo reemplazamos la línea exacta del menú-group-links
  if (html.includes(REAL_NAV_LINK)) {
    html = html.replace(REAL_NAV_LINK, CASTELLANO_NAV_LINK);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    modified++;
    console.log(`✓ ${path.basename(filePath)}`);
  } else {
    skipped++;
  }
}

console.log(`\nListo: ${modified} archivos actualizados, ${skipped} sin cambios.`);
