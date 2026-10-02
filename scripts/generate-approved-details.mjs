import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifiedProperties } from '../src/data/properties.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://hosterias-santa-fe.pages.dev';
const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const category = property => property.type === 'hosteria' ? 'Hostería' : 'Hotel';
const ratesAvailable = fs.existsSync(path.join(root, 'src', 'data', 'verified-rate-ranges.json'));

// Curated copy references only the approved catalog and its documented source URLs.
const seoBySlug = {
  'hosteria-florida-tropical': {
    pageTitle: 'Hostería Florida Tropical | Cerca de Santa Fe de Antioquia',
    pageHeading: 'Hostería Florida Tropical cerca de Santa Fe de Antioquia',
    heroLocation: 'Cerca de Santa Fe de Antioquia',
    overviewHeading: 'Ubicación y datos de Hostería Florida Tropical',
    confirmationHeading: 'Antes de viajar a Hostería Florida Tropical',
    description: 'Conoce Hostería Florida Tropical cerca de Santa Fe de Antioquia y solicita confirmación de servicios, fechas y tarifa vigente.',
    question: 'Si buscas una hostería campestre, confirma la dirección exacta, cómo llegar y qué servicios están disponibles en tus fechas.',
    related: ['hosteria-fundadores', 'hotel-mariscal-robledo'],
  },
  'hosteria-fundadores': {
    overviewHeading: 'Dónde está Hostería Los Fundadores',
    confirmationHeading: 'Qué confirmar con Hostería Los Fundadores',
    description: 'Explora la ficha de Hostería Los Fundadores en la Carrera 13 de Santa Fe de Antioquia. Consulta disponibilidad, condiciones y tarifa para tus fechas.',
    question: 'La dirección indicada es Carrera 13 No. 16-23. Confirma acceso, parqueo si lo necesitas y condiciones de la habitación antes de reservar.',
    related: ['hosteria-florida-tropical', 'hotel-porton-del-sol'],
  },
  'hotel-mariscal-robledo': {
    overviewHeading: 'Hotel Mariscal Robledo en el Centro Histórico',
    confirmationHeading: 'Antes de alojarte en Hotel Mariscal Robledo',
    description: 'Consulta la ficha de Hotel Mariscal Robledo en el Centro Histórico de Santa Fe de Antioquia y pide condiciones y tarifa vigentes para tus fechas.',
    question: 'La ubicación indicada es Carrera 12 # 9-70, Centro Histórico. Confirma cómo llegar y los servicios incluidos para las fechas de tu viaje.',
    related: ['hosteria-fundadores', 'hotel-la-iguana'],
  },
  'hotel-porton-del-sol': {
    overviewHeading: 'Ubicación y datos de Hotel Portón del Sol',
    confirmationHeading: 'Qué consultar sobre Hotel Portón del Sol',
    description: 'Revisa la ficha de Hotel Portón del Sol en Santa Fe de Antioquia y solicita la dirección, disponibilidad y condiciones para tus fechas.',
    question: 'Antes de elegir esta opción, solicita la dirección exacta y confirma la ocupación permitida, los servicios y las condiciones de pago.',
    related: ['hotel-la-iguana', 'hosteria-florida-tropical'],
  },
  'hotel-la-iguana': {
    overviewHeading: 'Información inicial de Hotel Iguana',
    confirmationHeading: 'Qué confirmar con Hotel Iguana',
    description: 'Explora la ficha de Hotel Iguana en Santa Fe de Antioquia y consulta ubicación exacta, disponibilidad y condiciones vigentes para tu viaje.',
    question: 'Pide la dirección exacta y verifica qué servicios y condiciones aplican a tu habitación y a las fechas elegidas.',
    related: ['hotel-porton-del-sol', 'hotel-mariscal-robledo'],
  },
};

function wizard(name) {
  return `<div id="leadWizard" class="wizard" hidden role="dialog" aria-modal="true" aria-labelledby="wizardTitle"><button class="wizard-backdrop" data-close aria-label="Cerrar"></button><div class="wizard-panel"><button class="close" data-close aria-label="Cerrar"><span class="material-symbols-rounded">close</span></button><p class="eyebrow">Solicitud de orientación</p><h2 id="wizardTitle">Consulta por ${esc(name)}</h2><form id="leadForm"><input type="text" name="_hp" class="hp" tabindex="-1" autocomplete="off"><label>Alojamiento de interés <input id="property" name="property" readonly placeholder="${esc(name)}"></label><div class="two"><label>Fecha aproximada <input type="date" name="checkIn"></label><label>Adultos <input type="number" name="adults" min="1" max="20" value="2" required></label></div><label>Nombre completo <input name="fullName" autocomplete="name" maxlength="100" required></label><label>Teléfono <input name="phone" type="tel" autocomplete="tel" placeholder="300 123 4567" required></label><label class="consent"><input name="consent" type="checkbox" required> <span>Acepto el <a href="/politica-privacidad" target="_blank" rel="noopener">tratamiento de datos</a> para recibir respuesta.</span></label><p id="formStatus" role="alert"></p><button class="primary" type="submit">Enviar solicitud</button><small>Enviar no confirma reserva, precio ni disponibilidad.</small></form></div></div>`;
}

for (const property of verifiedProperties) {
  const name = esc(property.name);
  const slug = esc(property.slug);
  const type = category(property);
  const seo = seoBySlug[property.slug];
  if (!seo) throw new Error(`Missing approved SEO copy for ${property.slug}`);
  const title = esc(seo.pageTitle || `${property.name} | Santa Fe de Antioquia`);
  const heading = esc(seo.pageHeading || `${property.name} en Santa Fe de Antioquia`);
  const heroLocation = esc(seo.heroLocation || 'Santa Fe de Antioquia');
  const description = esc(seo.description);
  const related = seo.related.map(relatedSlug => {
    const other = verifiedProperties.find(item => item.slug === relatedSlug);
    if (!other) throw new Error(`Unknown related property: ${relatedSlug}`);
    return `<article><span class="material-symbols-rounded" aria-hidden="true">hotel</span><h3>${esc(other.name)}</h3><p>${category(other)} · ${esc(other.sector)}</p><a href="/${esc(other.slug)}">Ver ficha</a></article>`;
  }).join('');
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
      <div class="hero-copy"><p class="eyebrow">${type} · ${heroLocation}</p><h1>${heading}</h1><p>${esc(property.shortDescription)}</p><button class="primary" data-lw-open data-property="${name}">Consultar esta opción <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></button><small>Imagen de referencia. La disponibilidad, los servicios y la tarifa requieren confirmación.</small></div>
    </section>
    <section class="section detail-overview" aria-labelledby="detail-info-title"><div class="heading"><p class="eyebrow">Información inicial</p><h2 id="detail-info-title">${esc(seo.overviewHeading)}</h2><p>Esta ficha presenta datos básicos para ayudarte a comparar alojamientos. Confirma los detalles vigentes antes de planear tu viaje.</p></div><div class="detail-facts"><article><span class="material-symbols-rounded" aria-hidden="true">location_on</span><h3>Ubicación indicada</h3><p>${sector}</p></article><article><span class="material-symbols-rounded" aria-hidden="true">hotel</span><h3>Tipo de alojamiento</h3><p>${type}</p></article><article><span class="material-symbols-rounded" aria-hidden="true">open_in_new</span><h3>Información directa</h3><p><a href="${officialUrl}" target="_blank" rel="noopener noreferrer">Visitar el sitio del establecimiento</a></p></article></div></section>
${ratesAvailable ? `    <section class="section verified-rate" data-property-id="${esc(property.id)}" data-property-slug="${slug}" hidden aria-labelledby="rate-title"><div class="rate-panel"><p class="eyebrow">Referencia de tarifa</p><h2 id="rate-title">Rango orientativo verificado</h2><p class="rate-amount"></p><p class="rate-context"></p><p class="rate-note"></p><button class="primary" data-lw-open data-property="${name}">Consultar tarifa vigente <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></button></div></section>` : ''}
    <section class="section how"><div class="heading"><p class="eyebrow">Antes de viajar</p><h2>${esc(seo.confirmationHeading)}</h2><p>${esc(seo.question)} Enviar la solicitud no crea una reserva.</p></div><button class="primary" data-lw-open data-property="${name}">Solicitar orientación <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></button></section>
    <section class="section detail-overview" aria-labelledby="related-title"><div class="heading"><p class="eyebrow">Sigue comparando</p><h2 id="related-title">Otros alojamientos en Santa Fe de Antioquia</h2><p>Revisa otras fichas de la selección y consulta directamente las condiciones que te interesen.</p></div><div class="detail-facts">${related}</div></section>
    <section class="final-cta"><p class="eyebrow">Más opciones</p><h2>Compara alojamientos en Santa Fe de Antioquia</h2><p>Explora la selección inicial de hosterías y hoteles.</p><a class="primary" href="/">Ver las cinco opciones</a></section>
  </main>
  <footer><a class="brand" href="/">Hosterías <span>Santa Fe</span></a><p>Directorio independiente en etapa de validación.</p><nav><a href="/politica-privacidad">Privacidad</a><a href="/terminos">Términos</a></nav></footer>
  ${wizard(property.name)}
  <script src="/assets/js/mvp.js" defer></script>
${ratesAvailable ? '  <script type="module" src="/assets/js/verified-rates.js"></script>' : ''}
</body></html>
`;
  fs.writeFileSync(path.join(root, `${property.slug}.html`), html);
}
