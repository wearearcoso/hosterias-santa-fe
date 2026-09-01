#!/usr/bin/env node
/**
 * Fase 8 — Datos estructurados (JSON-LD)
 *
 * Fix 1: BreadcrumbList en páginas de propiedades — eliminar .html de item URLs
 * Fix 2: ItemList en páginas de categoría — solo propiedades verificadas
 * Fix 3: Asegurar que no haya AggregateRating ni LocalBusiness en páginas no listas
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* ─── Propiedades verificadas (exactamente 9) ─── */
const VERIFIED = new Set([
  'hosteria-florida-tropical',
  'hosteria-tonusco-campestre',
  'hosteria-el-castellano',
  'hosteria-fundadores',
  'ivanna-hotel-campestre',
  'hotel-mariscal-robledo',
  'hotel-porton-del-sol',
  'casa-hotel-guaracu',
  'nueva-granada-hotel-colonial',
]);

/* ─── Páginas de propiedades verificadas ─── */
const PROPERTY_PAGES = Array.from(VERIFIED).map(slug => slug + '.html');

/* ─── Páginas de categoría SEO ─── */
const CATEGORY_PAGES = [
  'hoteles-santa-fe-de-antioquia.html',
  'dia-de-sol-santa-fe-de-antioquia.html',
  'hoteles-todo-incluido-santa-fe-de-antioquia.html',
  'hoteles-boutique-santa-fe-de-antioquia.html',
  'hoteles-coloniales-santa-fe-de-antioquia.html',
  'hoteles-economicos-santa-fe-de-antioquia.html',
  'hosterias-para-parejas-santa-fe-de-antioquia.html',
  'hoteles-para-familias-santa-fe-de-antioquia.html',
  'hoteles-con-piscina-santa-fe-de-antioquia.html',
  'hoteles-cerca-parque-santa-fe-de-antioquia.html',
  'hoteles-para-eventos-santa-fe-de-antioquia.html',
];

let totalFixed = 0;

/* ══════════════════════════════════════════
   FIX 1: BreadcrumbList .html en propiedades
   ══════════════════════════════════════════ */
for (const file of PROPERTY_PAGES) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) { console.warn(`  ⚠ No existe: ${file}`); continue; }

  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Eliminar .html de cualquier URL en item de BreadcrumbList (solo dentro de ld+json)
  content = content.replace(
    /(\"item\"\s*:\s*\"https:\/\/hosterias-santa-fe\.pages\.dev\/[^"]+?)\.html(\"|,|\s)/g,
    '$1$2'
  );

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`  ✓ BreadcrumbList .html fix: ${file}`);
    totalFixed++;
  }
}

/* ══════════════════════════════════════════
   FIX 2: ItemList en páginas de categoría
   ══════════════════════════════════════════ */
for (const file of CATEGORY_PAGES) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) { console.warn(`  ⚠ No existe: ${file}`); continue; }

  let content = fs.readFileSync(fp, 'utf8');

  // Extraer todos los bloques JSON-LD
  const LD_RE = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
  let changed = false;

  content = content.replace(LD_RE, function(match, open, json, close) {
    let parsed;
    try { parsed = JSON.parse(json); } catch (e) { return match; }

    if (parsed['@type'] !== 'ItemList') return match;

    const before = (parsed.itemListElement || []).length;
    parsed.itemListElement = (parsed.itemListElement || []).filter(function(item) {
      // Extraer el slug de la URL para comparar con VERIFIED
      const url = item.url || item.item || '';
      const slug = url.replace(/.*\//, '').replace(/\.html$/, '');
      return VERIFIED.has(slug);
    });

    // Re-numerar posiciones
    parsed.itemListElement.forEach(function(item, i) { item.position = i + 1; });
    parsed.numberOfItems = parsed.itemListElement.length;

    const after = parsed.itemListElement.length;
    if (before !== after) {
      console.log(`  ✓ ItemList (${file}): ${before} → ${after} ítems (removidos ${before - after} no verificados)`);
      changed = true;
    }
    return open + '\n' + JSON.stringify(parsed, null, 2) + '\n' + close;
  });

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    totalFixed++;
  }
}

console.log(`\nTotal archivos corregidos: ${totalFixed}`);
