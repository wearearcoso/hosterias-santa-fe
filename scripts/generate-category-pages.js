#!/usr/bin/env node
/**
 * Genera las 12 páginas SEO de categoría a partir de src/data/properties.js
 * Uso: node scripts/generate-category-pages.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT  = ROOT;
const SITE = 'https://hosterias-santa-fe.pages.dev';

// ─── Cargar propiedades ──────────────────────────────────────────────────────
// Simular el módulo (CommonJS compatible con el ES module de properties.js)
const propertiesCode = fs.readFileSync(path.join(ROOT, 'src/data/properties.js'), 'utf8');
// Extraer PROPERTIES array via eval en contexto seguro
let PROPERTIES;
try {
  // Reemplazar export statements para CommonJS
  const sanitized = propertiesCode
    .replace(/^export\s+(const|let|var|function|default)/gm, (m, kw) => kw === 'default' ? 'module.exports =' : `const _exported_${kw} =`)
    .replace(/^export\s*\{[^}]*\}\s*;?/gm, '');
  eval(sanitized);
} catch(e) {
  // Fallback: parse PROPERTIES directly
  const match = propertiesCode.match(/const PROPERTIES\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error('Cannot parse PROPERTIES from properties.js');
  PROPERTIES = eval(match[1]);
}

const verified = PROPERTIES.filter(p => p.status === 'verified');

// ─── Definición de categorías ────────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: 'hoteles-santa-fe-de-antioquia',
    title: 'Hoteles en Santa Fe de Antioquia | Guía 2026',
    h1: 'Hoteles en Santa Fe de Antioquia',
    metaDesc: 'Compara los mejores hoteles y hosterías en Santa Fe de Antioquia. Piscina, todo incluido, colonial, boutique. Un asesor confirma disponibilidad y tarifa.',
    intro: 'Santa Fe de Antioquia tiene opciones para todos: hoteles coloniales en el centro histórico, hosterías campestres con piscina, boutiques de lujo y opciones económicas con excelente relación calidad-precio.',
    breadcrumb: 'Hoteles',
    filter: () => verified,
    faq: [
      { q: '¿Cuál es el mejor hotel en Santa Fe de Antioquia?', a: 'Depende de lo que buscas. Para lujo, Hotel Mariscal Robledo. Para familias con piscina, Florida Tropical o Tonusco Campestre. Para presupuesto ajustado, Hostería Fundadores.' },
      { q: '¿Cuánto cuesta un hotel en Santa Fe de Antioquia?', a: 'Desde $87.000 por persona en opciones económicas hasta $320.000+ por noche en hoteles boutique. Un asesor confirma la tarifa exacta según fecha y plan.' },
      { q: '¿Los precios incluyen desayuno?', a: 'Depende del plan y el establecimiento. Algunos tienen planes todo incluido; otros cobran alimentación aparte. Un asesor te indica qué incluye cada tarifa.' },
    ],
  },
  {
    slug: 'dia-de-sol-santa-fe-de-antioquia',
    title: 'Día de Sol en Santa Fe de Antioquia | Piscina y Almuerzo 2026',
    h1: 'Día de Sol en Santa Fe de Antioquia',
    metaDesc: 'Planes de pasadía en Santa Fe de Antioquia con piscina, almuerzo incluido y kayak. Escapada desde Medellín en 1h45. Un asesor confirma disponibilidad.',
    intro: 'El día de sol es la escapada perfecta desde Medellín: sale de madrugada, llega antes de las 9am y disfruta piscina, almuerzo típico y naturaleza hasta las 5pm. Varias hosterías tienen planes de pasadía sin necesidad de quedarse a dormir.',
    breadcrumb: 'Día de sol',
    filter: () => verified.filter(p => p.planTypes && p.planTypes.includes('dia-de-sol')),
    faq: [
      { q: '¿Qué incluye un día de sol en Santa Fe de Antioquia?', a: 'Generalmente: acceso a piscina, almuerzo típico y zonas de descanso. Algunos incluyen kayak, hamacas o actividades. Un asesor confirma los detalles de cada plan.' },
      { q: '¿Cuánto cuesta el día de sol?', a: 'Desde $75.000 por persona en opciones económicas hasta $110.000+ en planes más completos. Los precios son orientativos y un asesor confirma la tarifa para tu fecha.' },
      { q: '¿Desde qué hora hasta qué hora es el día de sol?', a: 'Generalmente de 9am a 5pm o 6pm. Se recomienda reservar con anticipación, especialmente fines de semana y festivos.' },
    ],
  },
  {
    slug: 'hoteles-todo-incluido-santa-fe-de-antioquia',
    title: 'Todo Incluido en Santa Fe de Antioquia | Alojamiento y Comidas 2026',
    h1: 'Hoteles Todo Incluido en Santa Fe de Antioquia',
    metaDesc: 'Planes todo incluido en Santa Fe de Antioquia: alojamiento, desayuno, almuerzo, cena y actividades. Hosterías campestres desde Medellín. Asesor confirma disponibilidad.',
    intro: 'Los planes todo incluido en Santa Fe de Antioquia cubren alojamiento, alimentación completa y acceso a instalaciones. Ideal para quienes quieren una experiencia sin sorpresas en la cuenta final.',
    breadcrumb: 'Todo incluido',
    filter: () => verified.filter(p => p.planTypes && p.planTypes.includes('todo-incluido')),
    faq: [
      { q: '¿Qué incluye el plan todo incluido en Santa Fe?', a: 'Varía por establecimiento, pero típicamente: alojamiento, desayuno, almuerzo, cena, acceso a piscina y actividades recreativas. Un asesor confirma exactamente qué incluye cada plan.' },
      { q: '¿El todo incluido tiene límite de bebidas?', a: 'Cada establecimiento tiene sus propias políticas. Algunos incluyen bebidas no alcohólicas ilimitadas; otros cobran licores aparte. Consúltalo antes de reservar.' },
    ],
  },
  {
    slug: 'hoteles-boutique-santa-fe-de-antioquia',
    title: 'Hoteles Boutique en Santa Fe de Antioquia | Diseño y Exclusividad 2026',
    h1: 'Hoteles Boutique en Santa Fe de Antioquia',
    metaDesc: 'Hoteles boutique en Santa Fe de Antioquia: diseño colonial, atención personalizada y experiencias únicas. Selva María, Nueva Granada y más. Asesor confirma disponibilidad.',
    intro: 'Los hoteles boutique de Santa Fe de Antioquia combinan arquitectura colonial restaurada con diseño contemporáneo, pocas habitaciones y atención personalizada. La experiencia está en los detalles.',
    breadcrumb: 'Boutique',
    filter: () => verified.filter(p =>
      (p.amenities && (p.amenities.includes('Boutique') || p.amenities.includes('Spa'))) ||
      (p.type === 'hotel' && p.occasions && p.occasions.includes('pareja'))
    ),
    faq: [
      { q: '¿Qué hace a un hotel boutique diferente?', a: 'Pocas habitaciones, diseño cuidado, atención personalizada y una identidad propia. En Santa Fe destacan por preservar la arquitectura colonial con comfort moderno.' },
      { q: '¿Los hoteles boutique son muy caros?', a: 'Tienen un precio superior al promedio por la atención personalizada, pero varían bastante. Un asesor te indica la tarifa real según fecha.' },
    ],
  },
  {
    slug: 'hoteles-coloniales-santa-fe-de-antioquia',
    title: 'Hoteles Coloniales en Santa Fe de Antioquia | Patrimonio y Encanto 2026',
    h1: 'Hoteles Coloniales en Santa Fe de Antioquia',
    metaDesc: 'Hoteles en casas coloniales en Santa Fe de Antioquia: patios, corredores y arquitectura patrimonio. Nueva Granada, Santa Bárbara y más. Asesor confirma tarifas.',
    intro: 'Santa Fe de Antioquia es Patrimonio Histórico Nacional. Hospedarse en una casa colonial restaurada es parte de la experiencia: patios interiores, corredores con baldosas y paredes de metro de espesor que mantienen el frescor natural.',
    breadcrumb: 'Coloniales',
    filter: () => verified.filter(p =>
      (p.amenities && p.amenities.some(a => a.toLowerCase().includes('colonial') || a.toLowerCase().includes('patrimon'))) ||
      (p.slug && (p.slug.includes('colonial') || p.slug.includes('santa-barbara') || p.slug.includes('nueva-granada')))
    ),
    faq: [
      { q: '¿Cuáles son los hoteles coloniales más conocidos?', a: 'Nueva Granada Hotel Colonial y Hotel Santa Bárbara Colonial son dos de los más representativos, con arquitectura patrimonial restaurada en el centro histórico.' },
      { q: '¿Tienen aire acondicionado los hoteles coloniales?', a: 'Algunos sí; otros confían en el grosor de las paredes coloniales que mantienen temperatura fresca. Un asesor confirma las comodidades.' },
    ],
  },
  {
    slug: 'hoteles-economicos-santa-fe-de-antioquia',
    title: 'Hoteles Económicos en Santa Fe de Antioquia | Desde $87.000 2026',
    h1: 'Hoteles Económicos en Santa Fe de Antioquia',
    metaDesc: 'Hoteles y hosterías económicas en Santa Fe de Antioquia desde $87.000 por persona con alimentación. Piscina, buena ubicación y buen precio. Asesor confirma disponibilidad.',
    intro: 'Viajar a Santa Fe de Antioquia no tiene que ser costoso. Hay opciones con piscina, buen servicio y alimentación incluida desde $87.000 por persona. La clave está en saber cuáles ofrecen la mejor relación calidad-precio para tu grupo.',
    breadcrumb: 'Económicos',
    filter: () => verified.filter(p => p.price && p.price.min && p.price.min <= 100000),
    faq: [
      { q: '¿Cuál es la opción más económica en Santa Fe?', a: 'Hostería Fundadores y Hostería Florida Tropical tienen planes desde $87.000 por persona con alimentación incluida.' },
      { q: '¿El precio económico implica baja calidad?', a: 'No necesariamente. Muchas hosterías económicas tienen piscina, restaurante y buen servicio. Un asesor puede orientarte sobre la mejor opción para tu presupuesto.' },
    ],
  },
  {
    slug: 'hosterias-para-parejas-santa-fe-de-antioquia',
    title: 'Hosterías para Parejas en Santa Fe de Antioquia | Románticas 2026',
    h1: 'Hosterías para Parejas en Santa Fe de Antioquia',
    metaDesc: 'Hosterías románticas para parejas en Santa Fe de Antioquia: jacuzzi, spa, atardecer y arquitectura colonial. Aniversarios, escapadas y celebraciones. Asesor confirma disponibilidad.',
    intro: 'Santa Fe de Antioquia es uno de los destinos románticos más populares de Antioquia. Atardeceres sobre el Río Cauca, calles empedradas coloniales, piscinas privadas y planes especiales para aniversarios y cumpleaños.',
    breadcrumb: 'Para parejas',
    filter: () => verified.filter(p => p.occasions && (p.occasions.includes('pareja') || p.occasions.includes('aniversario'))),
    faq: [
      { q: '¿Cuál es la mejor hostería para una escapada romántica?', a: 'Tonusco Campestre (jacuzzi privado en cabaña) y Mariscal Robledo (spa y restaurante gourmet) son muy populares para parejas. Depende del presupuesto y el ambiente que buscan.' },
      { q: '¿Tienen paquetes especiales para aniversarios?', a: 'Algunos establecimientos ofrecen detalles especiales para aniversarios. Un asesor puede verificar qué opciones hay disponibles para tu fecha.' },
    ],
  },
  {
    slug: 'hoteles-para-familias-santa-fe-de-antioquia',
    title: 'Hoteles para Familias en Santa Fe de Antioquia | Con Piscina 2026',
    h1: 'Hoteles para Familias en Santa Fe de Antioquia',
    metaDesc: 'Hoteles y hosterías para familias en Santa Fe de Antioquia: piscina infantil, zonas verdes, actividades y todo incluido. Escapada perfecta desde Medellín. Asesor confirma.',
    intro: 'Planear un viaje familiar a Santa Fe de Antioquia es más fácil de lo que parece. Las mejores hosterías tienen piscina infantil, zonas de juego, restaurante con menú para niños y habitaciones amplias para grupos familiares.',
    breadcrumb: 'Para familias',
    filter: () => verified.filter(p => p.occasions && p.occasions.includes('familia')),
    faq: [
      { q: '¿Cuál es la mejor opción para ir con niños pequeños?', a: 'Florida Tropical tiene piscina infantil y lago; Tonusco Campestre tiene parque infantil y zonas verdes amplias. Un asesor confirma qué instalaciones están disponibles en tu fecha.' },
      { q: '¿Cuánto cuesta llevar niños?', a: 'La mayoría de hosterías tienen tarifas reducidas para niños menores de 5 años. Las edades y descuentos varían por establecimiento; un asesor te informa.' },
    ],
  },
  {
    slug: 'hoteles-con-piscina-santa-fe-de-antioquia',
    title: 'Hoteles con Piscina en Santa Fe de Antioquia | Pasadía y Alojamiento 2026',
    h1: 'Hoteles con Piscina en Santa Fe de Antioquia',
    metaDesc: 'Hoteles y hosterías con piscina en Santa Fe de Antioquia: día de sol, todo incluido y alojamiento. Escapada desde Medellín en 1h45. Un asesor confirma disponibilidad.',
    intro: 'La piscina es el criterio más buscado en Santa Fe de Antioquia. Con clima cálido todo el año (28-34°C), una tarde junto a la piscina con almuerzo típico es el plan perfecto para escapar del frío de Medellín.',
    breadcrumb: 'Con piscina',
    filter: () => verified.filter(p => p.amenities && p.amenities.includes('Piscina')),
    faq: [
      { q: '¿Cuántas hosterías tienen piscina en Santa Fe?', a: 'La mayoría de las hosterías y hoteles campestres tienen piscina. Algunas tienen piscina infantil adicional. Un asesor confirma el estado y disponibilidad de la piscina para tu fecha.' },
      { q: '¿Se puede ir solo a la piscina sin hospedarse?', a: 'Sí, varias hosterías ofrecen planes de día de sol con acceso a piscina y almuerzo sin necesidad de alojamiento.' },
    ],
  },
  {
    slug: 'hoteles-cerca-parque-santa-fe-de-antioquia',
    title: 'Hoteles Cerca del Parque Principal en Santa Fe de Antioquia 2026',
    h1: 'Hoteles Cerca del Parque Principal en Santa Fe de Antioquia',
    metaDesc: 'Hoteles y hosterías a pasos del Parque Principal de Santa Fe de Antioquia. Ubica, catedral y centro histórico al alcance. Asesor confirma disponibilidad y tarifas.',
    intro: 'Estar cerca del Parque Principal de Santa Fe de Antioquia es estar en el corazón del centro histórico: la Catedral de Santa Fe, la Iglesia de Chiquinquirá, restaurantes, heladerías y artesanías al alcance a pie.',
    breadcrumb: 'Cerca del parque',
    filter: () => verified.filter(p =>
      (p.amenities && p.amenities.some(a => a.toLowerCase().includes('parque'))) ||
      (p.sector && p.sector.toLowerCase().includes('centro'))
    ),
    faq: [
      { q: '¿Qué hay cerca del Parque Principal?', a: 'La Catedral de Santa Fe, el Puente de Occidente (a 3km), la Plaza Mayor, museos, restaurantes típicos y tiendas de artesanías.' },
      { q: '¿Es mejor hospedarse en el centro o en las afueras?', a: 'El centro es ideal para quienes quieren caminar y explorar; las afueras son mejores para quienes buscan piscina y tranquilidad. Un asesor te orienta según lo que buscas.' },
    ],
  },
  {
    slug: 'hoteles-para-eventos-santa-fe-de-antioquia',
    title: 'Hoteles para Eventos en Santa Fe de Antioquia | Matrimonios y Grados 2026',
    h1: 'Hoteles para Eventos en Santa Fe de Antioquia',
    metaDesc: 'Venues para matrimonios, grados, cumpleaños y eventos empresariales en Santa Fe de Antioquia. Salones, piscina y catering. Un asesor confirma disponibilidad y capacidad.',
    intro: 'Santa Fe de Antioquia es un destino cada vez más elegido para matrimonios, grados y celebraciones especiales. La arquitectura colonial, el clima cálido y la distancia moderada desde Medellín lo hacen ideal para eventos de uno a varios días.',
    breadcrumb: 'Eventos',
    filter: () => verified.filter(p =>
      (p.occasions && (p.occasions.includes('negocio') || p.occasions.includes('cumpleanos') || p.occasions.includes('matrimonio'))) ||
      (p.amenities && p.amenities.some(a => a.toLowerCase().includes('evento') || a.toLowerCase().includes('sal')))
    ),
    faq: [
      { q: '¿Qué capacidad tienen los salones de eventos?', a: 'Varía según el establecimiento: desde salones íntimos de 30 personas hasta espacios para 200+. Un asesor confirma disponibilidad y capacidad para tu fecha y número de invitados.' },
      { q: '¿Incluyen catering?', a: 'La mayoría tienen restaurante propio y ofrecen menús de evento. Un asesor te informa sobre las opciones y costos de catering para tu celebración.' },
    ],
  },
  {
    slug: 'guia-santa-fe-de-antioquia',
    title: 'Guía de Santa Fe de Antioquia | Qué Ver, Qué Hacer y Dónde Hospedarse 2026',
    h1: 'Guía de Santa Fe de Antioquia',
    metaDesc: 'Guía completa de Santa Fe de Antioquia: qué ver, qué hacer, cómo llegar, dónde comer y cuáles son las mejores hosterías. Todo para planear tu escapada desde Medellín.',
    intro: 'Santa Fe de Antioquia es el destino de turismo histórico más completo de Antioquia. A 78 km de Medellín, combina arquitectura colonial del siglo XVI, clima cálido, gastronomía típica y hosterías con piscina para la escapada perfecta.',
    breadcrumb: 'Guía',
    filter: () => verified.slice(0, 6),
    isGuide: true,
    faq: [
      { q: '¿Cómo llegar a Santa Fe de Antioquia desde Medellín?', a: 'Son 78 km por la Autopista al Mar (vía Urabá). Aproximadamente 1h45 en carro. Hay buses desde el Terminal del Norte cada hora.' },
      { q: '¿Cuál es la mejor época para visitar?', a: 'Todo el año tiene clima cálido (28-34°C). Los fines de semana y festivos son más concurridos. Entre semana es más tranquilo y hay mejor disponibilidad.' },
      { q: '¿Qué lugares no se pueden perder?', a: 'El Puente de Occidente (1887), la Catedral de Santa Fe, el Parque Principal, el Museo Juan del Corral y las calles empedradas del centro histórico.' },
      { q: '¿Cuánto tiempo se necesita para visitar Santa Fe?', a: 'Un día de sol alcanza para el centro histórico y una hostería. Para vivirlo completo, se recomienda al menos un fin de semana.' },
    ],
  },
];

// ─── Template de tarjeta de propiedad ───────────────────────────────────────
function propertyCard(p) {
  const img = p.images && p.images[0];
  const imgSrc = img ? `assets/images/${img.src}` : 'assets/images/og-hosterias.jpg';
  const imgAlt = img ? img.alt : p.name;
  const price = p.price ? `Desde $${p.price.min.toLocaleString('es-CO')} / ${p.price.basis === 'person' ? 'persona' : 'noche'}` : '';
  const amenities = (p.amenities || []).slice(0, 4).map(a =>
    `<span class="cat-card-amenity">${a}</span>`
  ).join('');

  return `
      <article class="cat-card" data-animate>
        <a href="${p.slug}.html" class="cat-card-img-link">
          <img src="${imgSrc}" alt="${imgAlt}" loading="lazy" width="400" height="267">
        </a>
        <div class="cat-card-body">
          <div class="cat-card-badges">
            <span class="cat-card-type">${p.type === 'hotel' ? 'Hotel' : 'Hostería'}</span>
            ${p.sector ? `<span class="cat-card-sector">${p.sector}</span>` : ''}
          </div>
          <h3 class="cat-card-name"><a href="${p.slug}.html">${p.name}</a></h3>
          <p class="cat-card-desc">${p.shortDescription || ''}</p>
          <div class="cat-card-amenities">${amenities}</div>
        </div>
        <div class="cat-card-footer">
          ${price ? `<span class="cat-card-price">${price}</span>` : ''}
          <div class="cat-card-actions">
            <button class="btn-consult" data-lw-open data-lw-property-id="${p.id}" data-lw-property-name="${p.name}">Consultar</button>
            <a href="${p.slug}.html" class="r-ver-btn">Ver detalles</a>
          </div>
        </div>
      </article>`;
}

// ─── Template de página de categoría ────────────────────────────────────────
function buildPage(cat) {
  const props = cat.filter();
  const cards = props.length ? props.map(propertyCard).join('\n') : '<p>Próximamente más opciones verificadas.</p>';
  const canonical = `${SITE}/${cat.slug}`;

  const faqSchema = cat.faq.map(f =>
    `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`
  ).join(',\n    ');

  const itemListSchema = props.length ? `,
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "${cat.h1}",
    "numberOfItems": ${props.length},
    "itemListElement": [
      ${props.map((p, i) => `{"@type":"ListItem","position":${i+1},"name":${JSON.stringify(p.name)},"url":"${SITE}/${p.slug}"}`).join(',\n      ')}
    ]
  }` : '';

  const faqHtml = cat.faq.map(f => `
      <div class="faq-item">
        <button class="faq-trigger" aria-expanded="false">${f.q}</button>
        <div class="faq-answer" aria-hidden="true"><p>${f.a}</p></div>
      </div>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cat.title}</title>
  <meta name="description" content="${cat.metaDesc}">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${cat.title}">
  <meta property="og:description" content="${cat.metaDesc}">
  <meta property="og:locale" content="es_CO">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Inicio","item":"${SITE}/"},
      {"@type":"ListItem","position":2,"name":"${cat.breadcrumb}","item":"${canonical}"}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
    ${faqSchema}
    ]
  }
  </script>${itemListSchema ? `
  <script type="application/ld+json">
  ${itemListSchema}
  </script>` : ''}
</head>
<body class="has-top-bar">

<div class="top-bar" role="banner">
  <span class="top-bar-notice">Sitio en construcción · Datos de prueba · No operativo</span>
  <div class="top-bar-socials"><a href="#" aria-label="Instagram">Instagram</a><a href="#" aria-label="Facebook">Facebook</a></div>
</div>

<header class="field-header" id="header">
  <div style="display:flex;align-items:center;">
    <button class="hamburger-btn" aria-label="Abrir menú" aria-expanded="false">
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none"><line x1="0" y1="6" x2="32" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-line h-line-top"/><line x1="0" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-line h-line-bottom"/></svg>
    </button>
  </div>
  <a href="index.html" class="header-logo" aria-label="Inicio"><div class="logo-placeholder">HOSTERÍAS<br>SFA</div></a>
  <nav class="field-nav" aria-label="Navegación principal" hidden>
    <ul>
      <li><a href="index.html">Inicio</a></li>
      <li><a href="hosterias.html">Hosterías</a></li>
      <li><a href="hoteles.html">Hoteles</a></li>
      <li><a href="dia-de-sol.html">Día de Sol</a></li>
    </ul>
  </nav>
</header>

<!-- Hero compacto de categoría -->
<section class="cat-hero">
  <div class="container">
    <nav class="cat-breadcrumb" aria-label="Migas de pan">
      <a href="index.html">Inicio</a>
      <span aria-hidden="true"> › </span>
      <span>${cat.breadcrumb}</span>
    </nav>
    <h1 class="cat-hero-h1">${cat.h1}</h1>
    <p class="cat-hero-intro">${cat.intro}</p>
    <div class="cat-hero-cta">
      <button class="btn btn-primary" data-lw-open>
        <div class="btn-bg"></div>
        <span>Consultar disponibilidad</span>
      </button>
    </div>
  </div>
</section>

<!-- Grid de propiedades -->
<section class="cat-grid-section">
  <div class="container">
    <p class="cat-count">${props.length} opción${props.length !== 1 ? 'es' : ''} verificada${props.length !== 1 ? 's' : ''}</p>
    <div class="cat-grid">
      ${cards}
    </div>
    <p class="cat-price-disclaimer">Precios orientativos. Un asesor confirma tarifa exacta, disponibilidad e inclusiones para tus fechas.</p>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <div class="faq-inner">
    <div class="text-center" style="margin-bottom:var(--space-lg);">
      <p class="section-tag" style="justify-content:center;">${cat.h1}</p>
      <h2 class="section-title text-center" data-animate>Preguntas Frecuentes</h2>
    </div>
    <div class="faq-list" data-acc-group="faq-cat">
      ${faqHtml}
    </div>
  </div>
</section>

<!-- CTA Banner -->
<div class="cta-banner">
  <div class="container">
    <h3>¿No encontraste lo que buscas?</h3>
    <p>Un asesor revisa todas las opciones disponibles y te ayuda a encontrar el plan que mejor se ajuste a tu fecha, grupo y presupuesto.</p>
    <button class="btn btn-dark" data-lw-open style="cursor:pointer;font-size:var(--body-lg);padding:1rem 2rem;">
      <div class="btn-bg"></div>
      <span>Consultar con un asesor</span>
    </button>
  </div>
</div>

<footer class="field-footer" role="contentinfo">
  <svg class="footer-deco" viewBox="0 0 1440 200" fill="none" aria-hidden="true"><path class="svg-draw" d="M0 80 Q360 160 720 80 Q1080 0 1440 80" stroke="#0A0A0A" stroke-width="2.5" fill="none"/></svg>
  <div class="footer-grid">
    <div class="footer-logo-wrap" data-animate>
      <div class="footer-logo-text">HOSTERÍAS</div>
      <div class="footer-logo-sub">Santa Fe de Antioquia</div>
      <p style="font-size:var(--body-sm);color:rgba(0,0,0,.55);margin-top:var(--space-md);line-height:1.7;max-width:280px;">Tu guía de confianza para encontrar la hostería o hotel perfecto en Santa Fe de Antioquia.</p>
    </div>
    <div data-animate data-delay="1">
      <h4 class="footer-heading">Explorar</h4>
      <ul class="footer-links">
        <li><a href="hosterias.html">Hosterías</a></li>
        <li><a href="hoteles.html">Hoteles</a></li>
        <li><a href="dia-de-sol.html">Día de Sol</a></li>
        <li><a href="hoteles-con-piscina-santa-fe-de-antioquia.html">Con Piscina</a></li>
        <li><a href="hosterias-para-parejas-santa-fe-de-antioquia.html">Para Parejas</a></li>
      </ul>
    </div>
    <div data-animate data-delay="2">
      <h4 class="footer-heading">Legal</h4>
      <ul class="footer-links">
        <li><a href="politica-privacidad.html">Política de Privacidad</a></li>
        <li><a href="habeas-data.html">Habeas Data</a></li>
        <li><a href="terminos.html">Términos de Uso</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Hosterías Santa Fe de Antioquia · Datos de contacto de prueba · Sitio en construcción</p>
  </div>
</footer>

<!-- Lead Wizard Modal -->
<div id="leadWizardModal" class="lw-modal" role="dialog" aria-modal="true" aria-labelledby="lwModalTitle" hidden>
  <div class="lw-overlay" aria-hidden="true"></div>
  <div class="lw-dialog">
    <div class="lw-header">
      <div class="lw-header-inner">
        <p class="lw-step-label" id="lwStepLabel" aria-live="polite">Paso 1 de 7</p>
        <h2 class="lw-modal-title" id="lwModalTitle">Encuentra tu plan ideal</h2>
      </div>
      <button class="lw-close-btn" data-lw-close aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="lw-progress" role="progressbar" aria-valuemin="1" aria-valuemax="7" aria-valuenow="1">
      <div class="lw-progress-fill" id="lwProgressFill" style="width:14%"></div>
    </div>
    <div class="lw-dots" aria-hidden="true">
      <span class="lw-dot lw-dot--active" data-dot="1"></span><span class="lw-dot" data-dot="2"></span><span class="lw-dot" data-dot="3"></span><span class="lw-dot" data-dot="4"></span><span class="lw-dot" data-dot="5"></span><span class="lw-dot" data-dot="6"></span><span class="lw-dot" data-dot="7"></span>
    </div>
    <div id="lwErrorZone" class="lw-error" role="alert" aria-live="assertive" hidden></div>
    <div id="lwStepsContainer" class="lw-steps-container">
      <div class="lw-step lw-active" data-lwstep="1">
        <p class="lw-step-question">¿Qué tipo de plan buscas?</p>
        <div class="lw-plan-grid" role="group">
          <button type="button" class="lw-plan-btn" data-val="alojamiento" aria-pressed="false"><span class="lw-plan-icon">🛏️</span><span class="lw-plan-label">Alojamiento</span><span class="lw-plan-hint">Noche o fin de semana</span></button>
          <button type="button" class="lw-plan-btn" data-val="dia-de-sol" aria-pressed="false"><span class="lw-plan-icon">☀️</span><span class="lw-plan-label">Día de sol</span><span class="lw-plan-hint">Pasadía sin alojamiento</span></button>
          <button type="button" class="lw-plan-btn" data-val="todo-incluido" aria-pressed="false"><span class="lw-plan-icon">🍽️</span><span class="lw-plan-label">Todo incluido</span><span class="lw-plan-hint">Alojamiento + comidas</span></button>
          <button type="button" class="lw-plan-btn" data-val="celebracion" aria-pressed="false"><span class="lw-plan-icon">🎉</span><span class="lw-plan-label">Celebración</span><span class="lw-plan-hint">Cumple, grado, aniversario</span></button>
          <button type="button" class="lw-plan-btn" data-val="evento" aria-pressed="false"><span class="lw-plan-icon">🤝</span><span class="lw-plan-label">Evento</span><span class="lw-plan-hint">Matrimonio, empresarial</span></button>
        </div>
      </div>
      <div class="lw-step" data-lwstep="2" aria-hidden="true">
        <p class="lw-step-question">¿Cuándo quieres ir?</p>
        <label class="lw-checkbox-row" for="lwFechasFlexibles"><input type="checkbox" id="lwFechasFlexibles"><span>Fechas flexibles / aún no sé la fecha</span></label>
        <div id="lwDateFields" class="lw-date-fields">
          <div class="lw-field-row"><label for="lwCheckIn">Fecha de entrada</label><input type="date" id="lwCheckIn"></div>
          <div class="lw-field-row"><label for="lwCheckOut">Fecha de salida <span class="lw-optional">(opcional)</span></label><input type="date" id="lwCheckOut"></div>
        </div>
      </div>
      <div class="lw-step" data-lwstep="3" aria-hidden="true">
        <p class="lw-step-question">¿Cuántos viajan?</p>
        <div class="lw-counter-row" role="group" aria-label="Adultos"><span class="lw-counter-label">Adultos</span><div class="lw-counter"><button type="button" class="lw-counter-btn" data-counter="adults" data-action="minus" aria-label="Menos adultos" disabled>−</button><span id="lwAdultsVal" class="lw-counter-val" aria-live="polite">2</span><button type="button" class="lw-counter-btn" data-counter="adults" data-action="plus" aria-label="Más adultos">+</button></div></div>
        <div class="lw-counter-row" role="group" aria-label="Niños"><span class="lw-counter-label">Niños</span><div class="lw-counter"><button type="button" class="lw-counter-btn" data-counter="children" data-action="minus" aria-label="Menos niños" disabled>−</button><span id="lwChildrenVal" class="lw-counter-val" aria-live="polite">0</span><button type="button" class="lw-counter-btn" data-counter="children" data-action="plus" aria-label="Más niños">+</button></div></div>
        <div class="lw-field-row" style="margin-top:1.5rem"><label for="lwPresupuesto">Presupuesto <span class="lw-optional">(opcional)</span></label><select id="lwPresupuesto"><option value="">Prefiero no indicarlo</option><option>Menos de $300.000</option><option>$300.000 – $600.000</option><option>$600.000 – $1.000.000</option><option>$1.000.000 – $2.000.000</option><option>Más de $2.000.000</option></select></div>
      </div>
      <div class="lw-step" data-lwstep="4" aria-hidden="true">
        <p class="lw-step-question">¿Cuál es la ocasión?</p>
        <div class="lw-occasion-grid" role="group">
          <button type="button" class="lw-occasion-btn" data-val="Familia" aria-pressed="false">👨‍👩‍👧 Familia</button>
          <button type="button" class="lw-occasion-btn" data-val="Pareja" aria-pressed="false">💑 Pareja</button>
          <button type="button" class="lw-occasion-btn" data-val="Aniversario" aria-pressed="false">💍 Aniversario</button>
          <button type="button" class="lw-occasion-btn" data-val="Cumpleaños" aria-pressed="false">🎂 Cumpleaños</button>
          <button type="button" class="lw-occasion-btn" data-val="Matrimonio" aria-pressed="false">💒 Matrimonio</button>
          <button type="button" class="lw-occasion-btn" data-val="Amigos" aria-pressed="false">👥 Amigos</button>
          <button type="button" class="lw-occasion-btn" data-val="Otra" aria-pressed="false">✨ Otra</button>
        </div>
      </div>
      <div class="lw-step" data-lwstep="5" aria-hidden="true">
        <p class="lw-step-question">¿Qué buscas? <span class="lw-optional">Selecciona todo lo que aplique</span></p>
        <div class="lw-pref-grid" role="group">
          <button type="button" class="lw-pref-btn" data-val="Piscina" aria-pressed="false">🏊 Piscina</button>
          <button type="button" class="lw-pref-btn" data-val="Jacuzzi" aria-pressed="false">🛁 Jacuzzi</button>
          <button type="button" class="lw-pref-btn" data-val="Spa" aria-pressed="false">💆 Spa</button>
          <button type="button" class="lw-pref-btn" data-val="Alimentación incluida" aria-pressed="false">🍽️ Alimentación</button>
          <button type="button" class="lw-pref-btn" data-val="Pet friendly" aria-pressed="false">🐾 Pet friendly</button>
          <button type="button" class="lw-pref-btn" data-val="Cerca del parque" aria-pressed="false">🏛️ Cerca del parque</button>
          <button type="button" class="lw-pref-btn" data-val="Ambiente campestre" aria-pressed="false">🌿 Campestre</button>
          <button type="button" class="lw-pref-btn" data-val="Transporte desde Medellín" aria-pressed="false">🚌 Transporte</button>
        </div>
        <div class="lw-field-row" style="margin-top:1.25rem"><label for="lwNotas">Cuéntanos más <span class="lw-optional">(opcional)</span></label><textarea id="lwNotas" rows="3" maxlength="500" placeholder="Ej: viajamos con bebé, buscamos tobogán..."></textarea></div>
      </div>
      <div class="lw-step" data-lwstep="6" aria-hidden="true">
        <div class="lw-preliminary">
          <div class="lw-preliminary-icon" aria-hidden="true">🔍</div>
          <h3 class="lw-preliminary-title">Revisando opciones para ti</h3>
          <div class="lw-preliminary-data" id="lwPrelimResult"></div>
          <div class="lw-preliminary-notice">
            <p>Basado en lo que nos contaste, hay opciones que podrían ajustarse a tu plan.</p>
            <p><strong>Un asesor verificará precio exacto, disponibilidad e inclusiones para tus fechas.</strong></p>
          </div>
          <p class="lw-preliminary-cta">Para recibir las opciones concretas, déjanos tus datos en el siguiente paso.</p>
        </div>
      </div>
      <div class="lw-step" data-lwstep="7" aria-hidden="true">
        <p class="lw-step-question">¿Cómo te contactamos?</p>
        <input type="text" id="lwHoneypot" name="_hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">
        <div class="lw-field-row"><label for="lwNombre">Nombre completo <span class="lw-required" aria-hidden="true">*</span></label><input type="text" id="lwNombre" autocomplete="name" maxlength="100" required></div>
        <div class="lw-field-row"><label for="lwTelefono">WhatsApp o teléfono <span class="lw-required" aria-hidden="true">*</span></label><input type="tel" id="lwTelefono" autocomplete="tel" placeholder="300 123 4567" required></div>
        <div class="lw-field-row"><label for="lwCorreo">Correo electrónico <span class="lw-optional">(opcional)</span></label><input type="email" id="lwCorreo" autocomplete="email" maxlength="200"></div>
        <div class="lw-field-row">
          <p class="lw-field-label">¿Cómo prefieres que te contactemos?</p>
          <div class="lw-radio-group" role="radiogroup">
            <label class="lw-radio"><input type="radio" name="lwContactPref" value="undecided" checked><span>Aún no sé</span></label>
            <label class="lw-radio"><input type="radio" name="lwContactPref" value="whatsapp"><span>Por WhatsApp</span></label>
            <label class="lw-radio"><input type="radio" name="lwContactPref" value="phone"><span>Llamada</span></label>
          </div>
        </div>
        <label class="lw-checkbox-row lw-consent" for="lwHabeas"><input type="checkbox" id="lwHabeas" required><span>Acepto el <a href="/politica-privacidad" target="_blank" rel="noopener">tratamiento de mis datos personales</a> para ser contactado con opciones de hospedaje.</span></label>
      </div>
    </div>
    <div id="lwSuccess" class="lw-success" hidden data-wa-number="" data-wa-enabled="false">
      <div class="lw-success-check" aria-hidden="true">✓</div>
      <h3 class="lw-success-title">Recibimos tu solicitud</h3>
      <p class="lw-success-body">Un asesor revisará las opciones disponibles y confirmará contigo la tarifa, las condiciones y la alternativa que mejor se ajuste a tu plan.</p>
      <p class="lw-success-ref-row">Referencia: <code class="lw-success-ref"></code></p>
      <div class="lw-success-actions">
        <button type="button" id="lwBtnWaitAgent" class="lw-btn-wait">Esperar que un asesor me contacte</button>
        <button type="button" id="lwBtnWhatsapp" class="lw-btn-wa" hidden>Enviar por WhatsApp</button>
      </div>
    </div>
    <div id="lwFooter" class="lw-footer">
      <button type="button" id="lwBtnBack" class="lw-btn-back" style="display:none">← Atrás</button>
      <div class="lw-footer-spacer"></div>
      <button type="button" id="lwBtnNext" class="lw-btn-next">Continuar →</button>
      <button type="button" id="lwBtnSubmit" class="lw-btn-submit" style="display:none">Enviar solicitud</button>
    </div>
  </div>
</div>

<div class="mobile-cta-bar" aria-label="Consultar opciones">
  <button class="mobile-cta-btn" data-lw-open>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    Consultar opciones
  </button>
</div>

<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="assets/js/analytics.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/lead-wizard.js"></script>
</body>
</html>`;
}

// ─── Generar páginas ─────────────────────────────────────────────────────────
let count = 0;
for (const cat of CATEGORIES) {
  const html = buildPage(cat);
  const outPath = path.join(OUT, `${cat.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  const props = cat.filter();
  console.log(`  OK: ${cat.slug}.html (${props.length} propiedades)`);
  count++;
}
console.log(`\nDone. ${count} páginas generadas.`);
