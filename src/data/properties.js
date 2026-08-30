/**
 * Fuente única de verdad de propiedades.
 * status: "verified" → se publica | "pending" → sin publicar afirmaciones no confirmadas
 *
 * Para añadir una propiedad: agregar un objeto al array.
 * Para desactivarla: cambiar status a "inactive".
 * Para publicarla cuando se complete verificación: cambiar status a "verified".
 */

const PROPERTIES = [
  // ──────────────────────────────
  // HOSTERÍAS VERIFICADAS
  // ──────────────────────────────
  {
    id: 'florida-tropical',
    slug: 'hosteria-florida-tropical',
    name: 'Hostería Florida Tropical',
    type: 'hosteria',
    status: 'verified',
    shortDescription: 'El lago más grande del occidente antioqueño, 3 piscinas, kayak, pesca deportiva y planes todo incluido.',
    longDescription: 'La Hostería Florida Tropical es uno de los destinos más espectaculares de Santa Fe de Antioquia. Cuenta con el lago más grande del occidente antioqueño, ideal para kayak y pesca deportiva, tres piscinas para adultos y niños, amplias zonas verdes y un restaurante de comida típica antioqueña.',
    sector: 'Vía principal, Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol', 'todo-incluido'],
    occasions: ['familia', 'amigos', 'pareja'],
    amenities: ['Piscina', 'Lago', 'Kayak', 'Pesca', 'Todo incluido', 'Día de sol', 'Restaurante', 'Parqueadero', 'WiFi', 'Zonas verdes'],
    idealFor: ['Familias', 'Grupos de amigos', 'Naturaleza y aventura'],
    images: [
      { src: 'florida-tropical-01.webp', alt: 'Vista del lago en Hostería Florida Tropical', rightsStatus: 'licensed' },
      { src: 'florida-tropical-02.webp', alt: 'Piscina de Florida Tropical', rightsStatus: 'licensed' },
      { src: 'florida-tropical-03.webp', alt: 'Zonas verdes de Florida Tropical', rightsStatus: 'licensed' },
      { src: 'florida-tropical-04.webp', alt: 'Kayak en el lago', rightsStatus: 'licensed' },
      { src: 'florida-tropical-05.webp', alt: 'Hostería Florida Tropical', rightsStatus: 'licensed' },
    ],
    price: { min: 87000, max: null, currency: 'COP', basis: 'person', includes: ['Almuerzo', 'Acceso a piscinas', 'Lago'], verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [
      { q: '¿Qué incluye el plan todo incluido en Florida Tropical?', a: 'El plan incluye almuerzo típico, acceso a las 3 piscinas, uso del lago para kayak y pesca, zonas de descanso y parqueadero.' },
      { q: '¿Se puede hacer día de sol en Florida Tropical?', a: 'Sí, ofrecen plan pasadía de 9am a 5pm con almuerzo incluido.' },
      { q: '¿Cómo llego desde Medellín?', a: 'Son 78 km por la Autopista Medellín-Urabá, aproximadamente 1h45min.' },
      { q: '¿Es apta para niños?', a: 'Sí, tiene piscina infantil, lago con kayak y amplias zonas verdes.' },
    ],
  },
  {
    id: 'tonusco-campestre',
    slug: 'hosteria-tonusco-campestre',
    name: 'Hostería Tonusco Campestre',
    type: 'hosteria',
    status: 'verified',
    shortDescription: '33 cabañas con jacuzzi privado, spa, minigolf y planes todo incluido cerca del parque principal.',
    longDescription: 'Tonusco Campestre es una de las hosterías más completas de Santa Fe de Antioquia. Con 33 cabañas equipadas, jacuzzi privado en las cabañas de pareja, parque infantil, piscina para toda la familia y planes todo incluido.',
    sector: 'Vereda Tonusco, Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol', 'todo-incluido'],
    occasions: ['familia', 'pareja', 'aniversario', 'cumpleanos'],
    amenities: ['Cabañas', 'Jacuzzi', 'Piscina', 'Parque infantil', 'Todo incluido', 'Restaurante', 'Bar', 'Spa', 'Día de sol', 'Parqueadero'],
    idealFor: ['Parejas', 'Familias', 'Aniversarios', 'Escapadas románticas'],
    images: [
      { src: 'tonusco-hero.webp', alt: 'Vista general de Hostería Tonusco Campestre', rightsStatus: 'licensed' },
      { src: 'tonusco-cabanas.webp', alt: 'Cabañas de Tonusco Campestre', rightsStatus: 'licensed' },
      { src: 'tonusco-jacuzzi.webp', alt: 'Jacuzzi privado en cabaña', rightsStatus: 'licensed' },
      { src: 'tonusco-piscina.webp', alt: 'Piscina de Tonusco Campestre', rightsStatus: 'licensed' },
      { src: 'tonusco-hamacas.webp', alt: 'Zona de hamacas en Tonusco', rightsStatus: 'licensed' },
    ],
    price: { min: 120000, max: null, currency: 'COP', basis: 'person', includes: ['Alojamiento', 'Alimentación', 'Piscina', 'Jacuzzi'], verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [
      { q: '¿Cuántas cabañas tiene Tonusco Campestre?', a: '33 cabañas, entre familiares y de pareja con jacuzzi privado.' },
      { q: '¿Qué incluye el plan todo incluido?', a: 'Alojamiento, desayuno, almuerzo, cena, acceso a piscina, jacuzzi y actividades recreativas.' },
      { q: '¿Es pet friendly?', a: 'Sí, recibe mascotas. Se recomienda consultar disponibilidad de cabañas pet friendly.' },
    ],
  },
  {
    id: 'castellano',
    slug: 'hosteria-el-castellano',
    name: 'Hostería El Castellano',
    type: 'hosteria',
    status: 'verified',
    shortDescription: 'Ambiente campestre tranquilo a solo 4 km del centro histórico, con piscina y zonas verdes.',
    sector: 'Km 4 vía al mar, Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol'],
    occasions: ['familia', 'pareja', 'amigos'],
    amenities: ['Piscina', 'Zonas verdes', 'Restaurante', 'Parqueadero', 'WiFi'],
    idealFor: ['Familias', 'Quienes buscan tranquilidad'],
    images: [
      { src: 'castellano-01.webp', alt: 'Hostería El Castellano', rightsStatus: 'licensed' },
      { src: 'castellano-03.webp', alt: 'Piscina de El Castellano', rightsStatus: 'licensed' },
      { src: 'castellano-05.webp', alt: 'Zonas verdes El Castellano', rightsStatus: 'licensed' },
    ],
    price: { min: 90000, max: null, currency: 'COP', basis: 'person', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [
      { q: '¿A qué distancia está del centro?', a: 'A 4 km, aproximadamente 8 minutos en carro.' },
      { q: '¿Tiene piscina?', a: 'Sí, cuenta con piscina para adultos y niños rodeada de zonas verdes.' },
    ],
  },
  {
    id: 'fundadores',
    slug: 'hosteria-fundadores',
    name: 'Hostería Fundadores',
    type: 'hosteria',
    status: 'verified',
    shortDescription: 'La opción más económica del centro, a 7 cuadras del Parque Principal, con piscina y restaurante.',
    sector: 'Centro, 7 cuadras del Parque Principal',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol'],
    occasions: ['familia', 'amigos'],
    amenities: ['Piscina', 'Restaurante', 'WiFi', 'Parqueadero'],
    idealFor: ['Viajeros con presupuesto ajustado', 'Familias', 'Grupos'],
    images: [
      { src: 'fundadores-01.webp', alt: 'Hostería Fundadores Santa Fe de Antioquia', rightsStatus: 'licensed' },
      { src: 'fundadores-02.webp', alt: 'Piscina Hostería Fundadores', rightsStatus: 'licensed' },
      { src: 'fundadores-03.webp', alt: 'Hostería Fundadores', rightsStatus: 'licensed' },
    ],
    price: { min: 87000, max: null, currency: 'COP', basis: 'person', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [
      { q: '¿Es la hostería más económica?', a: 'Es una de las más económicas, con tarifas desde $87.000 por persona con alimentación incluida.' },
      { q: '¿Tiene piscina?', a: 'Sí, cuenta con piscina y zonas de descanso.' },
    ],
  },
  {
    id: 'ivanna',
    slug: 'ivanna-hotel-campestre',
    name: 'Ivanna Hotel Campestre',
    type: 'hosteria',
    status: 'verified',
    shortDescription: 'Hotel campestre todo incluido con piscina, atención personalizada y ambiente íntimo.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'todo-incluido'],
    occasions: ['pareja', 'familia', 'aniversario'],
    amenities: ['Todo incluido', 'Piscina', 'Actividades', 'Restaurante'],
    idealFor: ['Parejas', 'Familias', 'Escapadas especiales'],
    images: [
      { src: 'ivanna-02.webp', alt: 'Ivanna Hotel Campestre', rightsStatus: 'licensed' },
      { src: 'ivanna-03.webp', alt: 'Piscina Ivanna Hotel', rightsStatus: 'licensed' },
      { src: 'ivanna-04.webp', alt: 'Ambiente Ivanna Hotel Campestre', rightsStatus: 'licensed' },
    ],
    price: { min: 160000, max: null, currency: 'COP', basis: 'person', includes: ['Todo incluido'], verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },

  // ──────────────────────────────
  // HOTELES VERIFICADOS
  // ──────────────────────────────
  {
    id: 'mariscal-robledo',
    slug: 'hotel-mariscal-robledo',
    name: 'Hotel Mariscal Robledo',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'El mejor valorado de Santa Fe. Arquitectura colonial restaurada, piscina, spa y restaurante gourmet en el centro histórico.',
    sector: 'Centro Histórico',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'aniversario', 'cumpleanos', 'negocio'],
    amenities: ['Piscina', 'Spa', 'Restaurante gourmet', 'WiFi', 'Parqueadero', 'Sala de eventos'],
    idealFor: ['Parejas', 'Viajes de lujo', 'Aniversarios', 'Viajeros exigentes'],
    images: [
      { src: 'mariscal-robledo-05.webp', alt: 'Hotel Mariscal Robledo Santa Fe de Antioquia', rightsStatus: 'licensed' },
    ],
    price: { min: 320000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'porton-del-sol',
    slug: 'hotel-porton-del-sol',
    name: 'Hotel Portón del Sol',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'El hotel de mayor capacidad de Santa Fe: 60 habitaciones, 16 suites, piscina y espacios para eventos.',
    sector: 'Entrada del municipio',
    rnt: null,
    planTypes: ['alojamiento', 'evento'],
    occasions: ['familia', 'negocio', 'matrimonio', 'graduacion'],
    amenities: ['Piscina', 'Sala de eventos', 'Restaurante', 'Parqueadero', 'WiFi', 'Suites'],
    idealFor: ['Eventos y celebraciones', 'Familias', 'Grupos corporativos'],
    images: [
      { src: 'porton-del-sol-01.webp', alt: 'Hotel Portón del Sol Santa Fe de Antioquia', rightsStatus: 'licensed' },
      { src: 'porton-del-sol-02.webp', alt: 'Piscina Portón del Sol', rightsStatus: 'licensed' },
      { src: 'porton-del-sol-03.webp', alt: 'Suites Portón del Sol', rightsStatus: 'licensed' },
    ],
    price: { min: 250000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'santa-fe-parque',
    slug: 'hotel-santa-fe-del-parque',
    name: 'Hotel Santa Fe del Parque',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'La opción más económica frente al Parque Principal. Habitaciones cómodas en el corazón del centro histórico.',
    sector: 'Frente al Parque Principal',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['familia', 'amigos', 'pareja'],
    amenities: ['WiFi', 'Desayuno opcional'],
    idealFor: ['Viajeros económicos', 'Quienes buscan ubicación central'],
    images: [
      { src: 'santa-fe-parque-01.webp', alt: 'Hotel Santa Fe del Parque', rightsStatus: 'licensed' },
      { src: 'santa-fe-parque-02.webp', alt: 'Habitación Hotel Santa Fe del Parque', rightsStatus: 'licensed' },
    ],
    price: { min: 80000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'santa-barbara',
    slug: 'hotel-santa-barbara-colonial',
    name: 'Hotel Santa Barbara Colonial',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'Casona colonial restaurada con el encanto de la arquitectura antioqueña. Desayuno incluido y ubicación céntrica.',
    sector: 'Centro Histórico',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'familia'],
    amenities: ['Desayuno incluido', 'WiFi', 'Patio colonial'],
    idealFor: ['Amantes del patrimonio', 'Parejas', 'Viajeros culturales'],
    images: [
      { src: 'santa-barbara-01.webp', alt: 'Hotel Santa Barbara Colonial', rightsStatus: 'licensed' },
      { src: 'santa-barbara-02.webp', alt: 'Patio colonial del Hotel Santa Barbara', rightsStatus: 'licensed' },
    ],
    price: { min: 95000, max: null, currency: 'COP', basis: 'night', includes: ['Desayuno'], verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'la-iguana',
    slug: 'hotel-la-iguana',
    name: 'Hotel La Iguana',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'Hotel con encanto tropical y jardines. Atención cálida y personalizada en una ubicación conveniente.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'familia'],
    amenities: ['Jardines tropicales', 'WiFi', 'Restaurante'],
    idealFor: ['Parejas', 'Viajeros que buscan encanto'],
    images: [
      { src: 'iguana-01.webp', alt: 'Hotel La Iguana Santa Fe de Antioquia', rightsStatus: 'licensed' },
      { src: 'iguana-02.webp', alt: 'Jardines Hotel La Iguana', rightsStatus: 'licensed' },
    ],
    price: { min: 90000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'guaracu',
    slug: 'casa-hotel-guaracu',
    name: 'Casa Hotel Guaracú',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'Hotel boutique con bicicletas gratuitas, piscina y desayuno incluido. Una experiencia auténtica.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'amigos'],
    amenities: ['Bicicletas gratis', 'Piscina', 'Desayuno incluido', 'WiFi'],
    idealFor: ['Viajeros activos', 'Parejas', 'Viajeros boutique'],
    images: [
      { src: 'guaracu-01.webp', alt: 'Casa Hotel Guaracú', rightsStatus: 'licensed' },
      { src: 'guaracu-02.webp', alt: 'Piscina Casa Hotel Guaracú', rightsStatus: 'licensed' },
    ],
    price: { min: 180000, max: null, currency: 'COP', basis: 'night', includes: ['Desayuno'], verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'nueva-granada',
    slug: 'nueva-granada-hotel-colonial',
    name: 'Nueva Granada Hotel Colonial',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'Hotel colonial en el centro histórico con atención personalizada. Uno de los mejor valorados.',
    sector: 'Centro Histórico',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'familia', 'aniversario'],
    amenities: ['WiFi', 'Desayuno', 'Patio colonial', 'Restaurante'],
    idealFor: ['Amantes del patrimonio', 'Parejas', 'Aniversarios'],
    images: [
      { src: 'nueva-granada-02.webp', alt: 'Nueva Granada Hotel Colonial', rightsStatus: 'licensed' },
      { src: 'nueva-granada-03.webp', alt: 'Patio Colonial Nueva Granada', rightsStatus: 'licensed' },
    ],
    price: { min: 190000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'selva-maria',
    slug: 'selva-maria-hotel-boutique',
    name: 'Selva María Hotel Boutique',
    type: 'hotel',
    status: 'verified',
    shortDescription: 'Hotel boutique exclusivo con pocas habitaciones y atención ultra personalizada. Para viajeros exigentes.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'aniversario', 'cumpleanos'],
    amenities: ['WiFi', 'Atención personalizada', 'Restaurante'],
    idealFor: ['Viajeros exigentes', 'Parejas', 'Experiencias boutique'],
    images: [
      { src: 'selva-maria-01.webp', alt: 'Selva María Hotel Boutique', rightsStatus: 'licensed' },
      { src: 'selva-maria-02.webp', alt: 'Habitación Selva María', rightsStatus: 'licensed' },
    ],
    price: { min: 210000, max: null, currency: 'COP', basis: 'night', verifiedAt: '2026-08' },
    sourceUrls: [],
    verifiedAt: '2026-08',
    faq: [],
  },
  {
    id: 'palser',
    slug: 'finca-hotel-tropical-palser',
    name: 'Finca Hotel Tropical PalSer',
    type: 'finca_hotel',
    status: 'pending', // pendiente de verificación completa
    shortDescription: 'Resort privado rodeado de naturaleza. La opción más exclusiva de Santa Fe de Antioquia.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento'],
    occasions: ['pareja', 'familia'],
    amenities: ['Piscina', 'Naturaleza', 'Privacidad'],
    idealFor: ['Quienes buscan privacidad y exclusividad'],
    images: [
      { src: 'palser-01.webp', alt: 'Finca Hotel Tropical PalSer', rightsStatus: 'pending' },
    ],
    price: { min: 490000, max: null, currency: 'COP', basis: 'night', verifiedAt: null },
    sourceUrls: [],
    verifiedAt: null,
    faq: [],
  },

  // ──────────────────────────────
  // PENDIENTES DE VERIFICACIÓN — no publicar como confirmados
  // ──────────────────────────────
  {
    id: 'hosteria-real',
    slug: 'hosteria-real',
    name: 'Hostería Real',
    type: 'hosteria',
    status: 'pending',
    shortDescription: 'Bar-restaurante con piscina y ambiente animado.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol'],
    occasions: ['amigos'],
    amenities: ['Piscina', 'Bar', 'Restaurante'],
    idealFor: ['Grupos de amigos', 'Celebraciones'],
    images: [
      { src: 'real-01.webp', alt: 'Hostería Real', rightsStatus: 'pending' },
    ],
    price: { min: 110000, max: null, currency: 'COP', basis: 'person', verifiedAt: null },
    sourceUrls: [],
    verifiedAt: null,
    faq: [],
  },
  {
    id: 'hosteria-paraiso',
    slug: 'hosteria-paraiso-santa-fe',
    name: 'Hostería Paraíso de Santa Fe',
    type: 'hosteria',
    status: 'pending',
    shortDescription: 'Ambiente familiar con piscina y zonas verdes.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['alojamiento', 'dia-de-sol'],
    occasions: ['familia'],
    amenities: ['Piscina', 'Zonas verdes', 'Restaurante'],
    idealFor: ['Familias'],
    images: [
      { src: 'paraiso-01.webp', alt: 'Hostería Paraíso Santa Fe', rightsStatus: 'pending' },
    ],
    price: { min: 90000, max: null, currency: 'COP', basis: 'person', verifiedAt: null },
    sourceUrls: [],
    verifiedAt: null,
    faq: [],
  },
  {
    id: 'bohios-bar',
    slug: 'hosteria-bohios-bar',
    name: 'Hostería Bohíos Bar',
    type: 'hosteria',
    status: 'pending',
    shortDescription: 'Piscina con lounge bar y ambiente animado.',
    sector: 'Santa Fe de Antioquia',
    rnt: null,
    planTypes: ['dia-de-sol'],
    occasions: ['amigos'],
    amenities: ['Piscina', 'Bar', 'Lounge'],
    idealFor: ['Grupos de amigos'],
    images: [
      { src: 'bohios-01.webp', alt: 'Hostería Bohíos Bar', rightsStatus: 'pending' },
    ],
    price: { min: 80000, max: null, currency: 'COP', basis: 'person', verifiedAt: null },
    sourceUrls: [],
    verifiedAt: null,
    faq: [],
  },
];

// Propiedades verificadas listas para publicar
export const verifiedProperties = PROPERTIES.filter(p => p.status === 'verified');

// Propiedades por slug (lookup rápido)
export const propertiesBySlug = Object.fromEntries(
  PROPERTIES.map(p => [p.slug, p])
);

// Propiedades por tipo (solo verificadas)
export const hosterias = verifiedProperties.filter(p => p.type === 'hosteria');
export const hoteles = verifiedProperties.filter(p => p.type === 'hotel');
export const fincasHotel = verifiedProperties.filter(p => p.type === 'finca_hotel');

// Propiedades por intención (solo verificadas)
export const conPiscina = verifiedProperties.filter(p => p.amenities.includes('Piscina'));
export const paraPareja = verifiedProperties.filter(p => p.occasions.includes('pareja'));
export const paraFamilias = verifiedProperties.filter(p => p.occasions.includes('familia'));
export const paraEventos = verifiedProperties.filter(p => p.planTypes.includes('evento'));
export const diaDeSOl = verifiedProperties.filter(p => p.planTypes.includes('dia-de-sol'));
export const todoIncluido = verifiedProperties.filter(p => p.planTypes.includes('todo-incluido'));
export const cercaParque = verifiedProperties.filter(p =>
  p.sector?.toLowerCase().includes('centro') ||
  p.occasions.includes('cerca-parque')
);
export const coloniales = verifiedProperties.filter(p =>
  p.amenities.some(a => a.toLowerCase().includes('colonial') || a.toLowerCase().includes('patio colonial'))
);
export const boutique = verifiedProperties.filter(p =>
  p.type === 'hotel' && (p.name.toLowerCase().includes('boutique') || p.id === 'guaracu')
);

export default PROPERTIES;
