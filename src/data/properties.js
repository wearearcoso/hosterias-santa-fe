const PROPERTIES = [
  {
    id: 'florida-tropical', slug: 'hosteria-florida-tropical', name: 'Hostería Florida Tropical', type: 'hosteria', status: 'verified',
    shortDescription: 'Alojamiento campestre en Santa Fe de Antioquia. Servicios y disponibilidad sujetos a confirmación.',
    sector: 'Santa Fe de Antioquia', sourceUrls: ['https://www.hosteriafloridatropical.com/'], verifiedAt: '2026-09-19',
    images: [{ src: 'florida-tropical-01.webp', alt: 'Imagen de referencia de Hostería Florida Tropical', rightsStatus: 'pending' }]
  },
  {
    id: 'fundadores', slug: 'hosteria-fundadores', name: 'Hostería Los Fundadores', type: 'hosteria', status: 'verified',
    shortDescription: 'Hostería ubicada en Santa Fe de Antioquia. Servicios y disponibilidad sujetos a confirmación.',
    sector: 'Carrera 13 No. 16-23', sourceUrls: ['https://hosteriafundadores.com/'], verifiedAt: '2026-09-19',
    images: [{ src: 'fundadores-01.webp', alt: 'Imagen de referencia de Hostería Los Fundadores', rightsStatus: 'pending' }]
  },
  {
    id: 'mariscal-robledo', slug: 'hotel-mariscal-robledo', name: 'Hotel Mariscal Robledo', type: 'hotel', status: 'verified',
    shortDescription: 'Hotel en el centro histórico. Servicios y disponibilidad sujetos a confirmación.',
    sector: 'Carrera 12 # 9-70, Centro Histórico', sourceUrls: ['https://www.hotelmariscalrobledo.com/es/index.html'], verifiedAt: '2026-09-19',
    images: [{ src: 'mariscal-robledo-05.webp', alt: 'Imagen de referencia del Hotel Mariscal Robledo', rightsStatus: 'pending' }]
  },
  {
    id: 'porton-del-sol', slug: 'hotel-porton-del-sol', name: 'Hotel Portón del Sol', type: 'hotel', status: 'verified',
    shortDescription: 'Hotel en Santa Fe de Antioquia. Servicios y disponibilidad sujetos a confirmación.',
    sector: 'Santa Fe de Antioquia', sourceUrls: ['https://www.hotelportondelsol.com.co/'], verifiedAt: '2026-09-19',
    images: [{ src: 'porton-del-sol-01.webp', alt: 'Imagen de referencia del Hotel Portón del Sol', rightsStatus: 'pending' }]
  },
  {
    id: 'iguana', slug: 'hotel-la-iguana', name: 'Hotel Iguana', type: 'hotel', status: 'verified',
    shortDescription: 'Hotel en Santa Fe de Antioquia. Servicios y disponibilidad sujetos a confirmación.',
    sector: 'Santa Fe de Antioquia', sourceUrls: ['https://bernalohotels.com/hotel-iguana/'], verifiedAt: '2026-09-19',
    images: [{ src: 'iguana-01.webp', alt: 'Imagen de referencia del Hotel Iguana', rightsStatus: 'pending' }]
  }
];

export const verifiedProperties = PROPERTIES;
export const propertiesBySlug = Object.fromEntries(PROPERTIES.map(property => [property.slug, property]));
export const hosterias = PROPERTIES.filter(property => property.type === 'hosteria');
export const hoteles = PROPERTIES.filter(property => property.type === 'hotel');
export default PROPERTIES;
