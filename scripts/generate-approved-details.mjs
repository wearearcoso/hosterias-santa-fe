import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifiedProperties } from '../src/data/properties.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://hosterias-santa-fe.pages.dev';
const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const category = property => property.type === 'hosteria' ? 'Hostería' : 'Hotel';

function wizard(name) {
  return `<div id="leadWizard" class="wizard" hidden role="dialog" aria-modal="true" aria-labelledby="wizardTitle"><button class="wizard-backdrop" data-close aria-label="Cerrar"></button><div class="wizard-panel"><button class="close" data-close aria-label="Cerrar"><span class="material-symbols-rounded">close</span></button><p class="eyebrow">Solicitud de orientación</p><h2 id="wizardTitle">Consulta por ${esc(name)}</h2><form id="leadForm"><input type="text" name="_hp" class="hp" tabindex="-1" autocomplete="off"><label>Alojamiento de interés <input id="property" name="property" readonly placeholder="${esc(name)}"></label><div class="two"><label>Fecha aproximada <input type="date" name="checkIn"></label><label>Adultos <input type="number" name="adults" min="1" max="20" value="2" required></label></div><label>Nombre completo <input name="fullName" autocomplete="name" maxlength="100" required></label><label>Teléfono <input name="phone" type="tel" autocomplete="tel" placeholder="300 123 4567" required></label><label class="consent"><input name="consent" type="checkbox" required> <span>Acepto el <a href="/politica-privacidad" target="_blank" rel="noopener">tratamiento de datos</a> para recibir respuesta.</span></label><p id="formStatus" role="alert"></p><button class="primary" type="submit">Enviar solicitud</button><small>Enviar no confirma reserva, precio ni disponibilidad.</small></form></div></div>`;
}

for (const property of verifiedProperties) {
  const name = esc(property.name);
  const slug = esc(property.slug);
  const type = category(property);
  const title = `${name} en Santa Fe de Antioquia | Consulta información`;
  const description = `${name}: consulta ubicación general y solicita orientación para confirmar disponibilidad, servicios y tarifa vigente en Santa Fe de Antioquia.`;
  const image = esc(property.images[0].src);
  const sector = esc(property.sector);
  const officialUrl = esc(property.sourceUrls[0]);
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="noindex,nofollow">
  <link rel="canonical" href="${site}/${slug}">
  <meta property="og:type" content="website"><meta property="og:locale" content="es_CO">
  <meta property="og:url" content="${site}/${slug}"><meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}"><meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@0..1&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/mvp.css">
</head>
<body class="detail-page">
  <div class="staging">Sitio de prueba · La solicitud no es una reserva</div>
  <header class="site-header"><a class="brand" href="/">Hosterías <span>Santa Fe</span></a><a class="header-cta" href="/">Ver alojamientos</a></header>
  <main>
    <section class="hero detail-hero">
      <img src="/assets/images/${image}" alt="" width="1600" height="900">
      <div class="hero-shade"></div>
      <div class="hero-copy"><p class="eyebrow">${type} · Santa Fe de Antioquia</p><h1>${name} en Santa Fe de Antioquia</h1><p>${esc(property.shortDescription)}</p><button class="primary" data-lw-open data-property="${name}">Consultar esta opción <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></button><small>Imagen de referencia. La disponibilidad, los servicios y la tarifa requieren confirmación.</small></div>
    </section>
    <section class="section detail-overview" aria-labelledby="detail-info-title"><div class="heading"><p class="eyebrow">Información inicial</p><h2 id="detail-info-title">Conoce esta opción</h2><p>Esta ficha presenta datos básicos para ayudarte a comparar alojamientos. Confirma los detalles vigentes antes de planear tu viaje.</p></div><div class="detail-facts"><article><span class="material-symbols-rounded" aria-hidden="true">location_on</span><h3>Ubicación indicada</h3><p>${sector}</p></article><article><span class="material-symbols-rounded" aria-hidden="true">hotel</span><h3>Tipo de alojamiento</h3><p>${type}</p></article><article><span class="material-symbols-rounded" aria-hidden="true">open_in_new</span><h3>Información directa</h3><p><a href="${officialUrl}" target="_blank" rel="noopener noreferrer">Visitar el sitio del establecimiento</a></p></article></div></section>
    <section class="section how"><div class="heading"><p class="eyebrow">Antes de viajar</p><h2>Confirma lo que importa para tu estancia</h2><p>Comparte tus fechas y el número de viajeros. Te orientamos para verificar disponibilidad, condiciones y precio vigente; enviar la solicitud no crea una reserva.</p></div><button class="primary" data-lw-open data-property="${name}">Solicitar orientación <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></button></section>
    <section class="final-cta"><p class="eyebrow">Más opciones</p><h2>Compara alojamientos en Santa Fe de Antioquia</h2><p>Explora la selección inicial de hosterías y hoteles.</p><a class="primary" href="/">Ver las cinco opciones</a></section>
  </main>
  <footer><a class="brand" href="/">Hosterías <span>Santa Fe</span></a><p>Directorio independiente en etapa de validación.</p><nav><a href="/politica-privacidad">Privacidad</a><a href="/terminos">Términos</a></nav></footer>
  ${wizard(property.name)}
  <script src="/assets/js/mvp.js" defer></script>
</body></html>
`;
  fs.writeFileSync(path.join(root, `${property.slug}.html`), html);
}
