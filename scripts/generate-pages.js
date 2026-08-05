// Genera páginas individuales para cada establecimiento
const fs = require('fs');
const path = require('path');

const BASE = '/Users/sergioaldana/Claude/Hosterias Santa Fe de Antioquia';

const ESTABLECIMIENTOS = [
  { slug: 'hosteria-florida-tropical', nombre: 'Hostería Florida Tropical', tipo: 'hosteria',
    title: 'Hostería Florida Tropical Santa Fe de Antioquia — Lago, Piscina y Naturaleza',
    desc: 'Hostería Florida Tropical: lago más grande del occidente antioqueño, 3 piscinas, kayak, pesca y planes todo incluido en Santa Fe de Antioquia.',
    h1: 'Hostería Florida Tropical — Lago y Piscinas en Santa Fe de Antioquia',
    description: 'La Hostería Florida Tropical es uno de los destinos más espectaculares de Santa Fe de Antioquia. Cuenta con el lago más grande del occidente antioqueño, ideal para kayak y pesca deportiva, tres piscinas para adultos y niños, amplias zonas verdes y un restaurante de comida típica antioqueña.',
    precio: 'Desde $87.000 por persona',
    ubicacion: 'Vía principal, Santa Fe de Antioquia',
    amenities: 'Piscina,Lago,Kayak,Pesca,Todo incluido,Día de sol,Restaurante,Parqueadero,WiFi,Zonas verdes',
    imagenes: 'florida-tropical-01,florida-tropical-02,florida-tropical-03,florida-tropical-04,florida-tropical-05',
    faq: '¿Qué incluye el plan todo incluido en Florida Tropical?|El plan incluye almuerzo típico, acceso a las 3 piscinas, uso del lago para kayak y pesca, zonas de descanso y parqueadero.|¿Se puede hacer día de sol en Florida Tropical?|Sí, ofrecen plan pasadía de 9am a 5pm con almuerzo incluido desde $87.000 por persona.|¿Cómo llego a Florida Tropical desde Medellín?|Son 78 km por la Autopista Medellín-Urabá. Toma aproximadamente 1h45. La hostería está sobre la vía principal antes de llegar al casco urbano.|¿Florida Tropical es apta para niños?|Sí, es ideal para familias. Tiene piscina infantil, lago con kayak y amplias zonas verdes para que los niños jueguen.' },

  { slug: 'hosteria-tonusco-campestre', nombre: 'Hostería Tonusco Campestre', tipo: 'hosteria',
    title: 'Hostería Tonusco Campestre Santa Fe de Antioquia — Cabañas, Jacuzzi y Piscina',
    desc: 'Tonusco Campestre: 33 cabañas con jacuzzi, parque infantil y piscina. Planes todo incluido. Reserva directa al mejor precio.',
    h1: 'Hostería Tonusco Campestre — Cabañas con Jacuzzi en Santa Fe de Antioquia',
    description: 'Tonusco Campestre es una de las hosterías más completas de Santa Fe de Antioquia. Con 33 cabañas equipadas, jacuzzi privado en las cabañas de pareja, parque infantil, piscina para toda la familia y planes todo incluido. El lugar perfecto para una escapada de fin de semana desde Medellín.',
    precio: 'Desde $120.000 por persona',
    ubicacion: 'Vereda Tonusco, Santa Fe de Antioquia',
    amenities: 'Cabañas,Jacuzzi,Piscina,Parque infantil,Todo incluido,Restaurante,Bar 24h,Spa,Día de sol,Parqueadero',
    imagenes: 'tonusco-hero,tonusco-cabanas,tonusco-jacuzzi,tonusco-piscina,tonusco-hamacas',
    faq: '¿Cuántas cabañas tiene Tonusco Campestre?|Tonusco Campestre cuenta con 33 cabañas, entre familiares y de pareja con jacuzzi privado.|¿Qué incluye el plan todo incluido en Tonusco?|Incluye alojamiento, desayuno, almuerzo, cena, acceso a piscina, jacuzzi, zonas húmedas y actividades recreativas.|¿Tonusco Campestre es pet friendly?|Sí, Tonusco Campestre recibe mascotas. Se recomienda consultar disponibilidad de cabañas pet friendly al reservar.|¿Hay transporte desde Medellín?|No ofrecen transporte directo, pero puedes llegar en bus desde la Terminal del Norte ($35.000 aprox) o en carro particular (1h45).' },

  { slug: 'hosteria-el-castellano', nombre: 'Hostería El Castellano', tipo: 'hosteria',
    title: 'Hostería El Castellano Santa Fe de Antioquia — Campestre a 4 km del Centro',
    desc: 'Hostería El Castellano: ambiente campestre, piscina y naturaleza a solo 4 km del centro de Santa Fe de Antioquia. Reserva directa.',
    h1: 'Hostería El Castellano — Tranquilidad Campestre en Santa Fe de Antioquia',
    description: 'La Hostería El Castellano ofrece un ambiente campestre tranquilo a solo 4 kilómetros del centro histórico de Santa Fe de Antioquia. Rodeada de naturaleza, con piscina y zonas de descanso, es ideal para quienes buscan paz y desconexión sin alejarse demasiado del pueblo.',
    precio: 'Desde $90.000 por persona',
    ubicacion: 'Km 4 vía al mar, Santa Fe de Antioquia',
    amenities: 'Piscina,Zonas verdes,Restaurante,Parqueadero,WiFi',
    imagenes: 'castellano-01,castellano-02,castellano-03,castellano-04,castellano-05',
    faq: '¿A qué distancia está El Castellano del centro?|Está a 4 km del centro de Santa Fe de Antioquia, aproximadamente 8 minutos en carro.|¿Tiene piscina la Hostería El Castellano?|Sí, cuenta con piscina para adultos y niños, rodeada de zonas verdes.|¿Ofrecen día de sol?|Sí, ofrecen plan pasadía con almuerzo incluido. Consultar disponibilidad y precios.|¿Es apto para familias?|Sí, es un ambiente familiar, tranquilo y seguro para niños.' },

  { slug: 'hosteria-fundadores', nombre: 'Hostería Fundadores', tipo: 'hosteria',
    title: 'Hostería Fundadores Santa Fe de Antioquia — Económica y Céntrica',
    desc: 'Hostería Fundadores: económica, céntrica a 7 cuadras del Parque Principal. Piscina, restaurante y WiFi. Desde $87.000.',
    h1: 'Hostería Fundadores — La Mejor Opción Económica en Santa Fe de Antioquia',
    description: 'La Hostería Fundadores es la opción ideal para viajeros con presupuesto ajustado que no quieren sacrificar comodidad. Ubicada a solo 7 cuadras del Parque Principal, ofrece piscina, restaurante, WiFi y habitaciones cómodas. La mejor relación calidad-precio en Santa Fe de Antioquia.',
    precio: 'Desde $87.000 por persona',
    ubicacion: 'Centro, a 7 cuadras del Parque Principal',
    amenities: 'Piscina,Restaurante,WiFi,Económica,Céntrica,Parqueadero',
    imagenes: 'fundadores-01,fundadores-02,fundadores-03,fundadores-04,fundadores-05',
    faq: '¿Es la hostería más económica de Santa Fe de Antioquia?|Es una de las más económicas, con tarifas desde $87.000 por persona con alimentación incluida.|¿Está cerca del centro?|Sí, está a solo 7 cuadras de la Plaza Mayor. Puedes ir caminando a todos los atractivos del centro histórico.|¿Tiene piscina?|Sí, cuenta con piscina y zonas de descanso.|¿Ofrecen día de sol?|Sí, consulta disponibilidad y precios de pasadía directamente con la hostería.' },

  { slug: 'hosteria-paraiso-santa-fe', nombre: 'Hostería Paraíso de Santa Fe', tipo: 'hosteria',
    title: 'Hostería Paraíso de Santa Fe de Antioquia — Ambiente Familiar y Piscina',
    desc: 'Hostería Paraíso de Santa Fe: ambiente familiar, piscina y zonas verdes. Disfruta del clima cálido de Antioquia. Desde $90.000.',
    h1: 'Hostería Paraíso de Santa Fe — Diversión Familiar en Antioquia',
    description: 'La Hostería Paraíso de Santa Fe es un espacio pensado para el disfrute familiar. Con piscina, amplias zonas verdes, restaurante de comida casera y un ambiente acogedor, es el destino perfecto para un fin de semana de descanso en el clima cálido de Santa Fe de Antioquia.',
    precio: 'Desde $90.000 por persona',
    ubicacion: 'Santa Fe de Antioquia, Antioquia',
    amenities: 'Piscina,Zonas verdes,Restaurante,Familiar,Parqueadero',
    imagenes: 'paraiso-01,paraiso-02,paraiso-03,paraiso-04',
    faq: '¿Es apta para familias con niños?|Sí, es ideal para familias. Cuenta con piscina y zonas verdes donde los niños pueden jugar.|¿Ofrecen todo incluido?|Sí, consulta los planes todo incluido con alimentación y actividades.|¿Tiene parqueadero?|Sí, cuenta con parqueadero gratuito para huéspedes.' },

  { slug: 'hosteria-bohios-bar', nombre: 'Hostería Bohíos Bar', tipo: 'hosteria',
    title: 'Hostería Bohíos Bar Santa Fe de Antioquia — Piscina y Lounge',
    desc: 'Hostería Bohíos Bar: piscina con lounge bar, ambiente animado y buena música. Planes de día de sol en Santa Fe de Antioquia.',
    h1: 'Hostería Bohíos Bar — Piscina y Diversión en Santa Fe de Antioquia',
    description: 'Bohíos Bar es la hostería perfecta para quienes buscan un ambiente más animado en Santa Fe de Antioquia. Con piscina, lounge bar, buena música y excelente atención. Ideal para grupos de amigos, celebraciones y quienes quieren disfrutar de un día diferente.',
    precio: 'Desde $80.000 por persona',
    ubicacion: 'Santa Fe de Antioquia',
    amenities: 'Piscina,Bar,Lounge,Música,Restaurante,Día de sol',
    imagenes: 'bohios-01,bohios-02,bohios-03,bohios-04,bohios-05',
    faq: '¿Bohíos Bar es solo para adultos?|Es un ambiente animado pero reciben familias también. El ambiente depende del día y la temporada.|¿Tienen día de sol?|Sí, ofrecen plan pasadía con acceso a piscina y almuerzo desde $80.000.|¿Se puede reservar para eventos?|Sí, aceptan reservas para cumpleaños y celebraciones. Consulta disponibilidad.' },

  { slug: 'hosteria-real', nombre: 'Hostería Real', tipo: 'hosteria',
    title: 'Hostería Real Santa Fe de Antioquia — Bar, Restaurante y Piscina',
    desc: 'Hostería Real: bar-restaurante con piscina y ambiente festivo en Santa Fe de Antioquia. Ideal para grupos y celebraciones.',
    h1: 'Hostería Real — Sabor y Diversión en Santa Fe de Antioquia',
    description: 'La Hostería Real combina la experiencia de un buen restaurante-bar con las comodidades de una hostería. Piscina, carta variada de comidas y bebidas, y un ambiente festivo que la hace única. Perfecta para grupos de amigos y celebraciones especiales.',
    precio: 'Desde $110.000 por persona',
    ubicacion: 'Zona centro, Santa Fe de Antioquia',
    amenities: 'Piscina,Bar,Restaurante,Festivo,Día de sol,Parqueadero',
    imagenes: 'real-01,real-02,real-03,real-04,real-05',
    faq: '¿Es solo para adultos?|No, reciben familias también. El ambiente festivo es más notorio los fines de semana.|¿Tienen día de sol?|Sí, ofrecen pasadía con almuerzo y acceso a piscina. Consulta precios.|¿Aceptan reservas para grupos?|Sí, es ideal para grupos. Contacta para reservas de más de 10 personas.' },

  { slug: 'ivanna-hotel-campestre', nombre: 'Ivanna Hotel Campestre', tipo: 'hosteria',
    title: 'Ivanna Hotel Campestre Santa Fe de Antioquia — 4.5 Estrellas Todo Incluido',
    desc: 'Ivanna Hotel Campestre: 4.5 estrellas, plan todo incluido con piscina, alimentación y actividades. Atención personalizada en Santa Fe de Antioquia.',
    h1: 'Ivanna Hotel Campestre — Experiencia 4.5 Estrellas en Santa Fe de Antioquia',
    description: 'Ivanna Hotel Campestre es uno de los establecimientos mejor valorados de Santa Fe de Antioquia, con 4.5 estrellas. Ofrece planes todo incluido con alimentación completa, piscina, actividades recreativas y atención personalizada. Una experiencia premium en el occidente antioqueño.',
    precio: 'Desde $160.000 por persona',
    ubicacion: 'Vía al mar, Santa Fe de Antioquia',
    amenities: 'Piscina,Todo incluido,Restaurante,Actividades,WiFi,Parqueadero,4.5 estrellas',
    imagenes: 'ivanna-02,ivanna-03,ivanna-04,ivanna-05',
    faq: '¿Qué significa 4.5 estrellas en Ivanna Hotel Campestre?|Es la calificación de los huéspedes, reflejando la alta calidad del servicio, instalaciones y atención.|¿Qué incluye el todo incluido?|Incluye alojamiento, desayuno, almuerzo, cena, acceso a piscina y actividades recreativas programadas.|¿Es apto para parejas?|Sí, es ideal para parejas que buscan una experiencia premium con atención personalizada.' },

  { slug: 'hotel-spa-santa-fe-colonial', nombre: 'Hotel y Spa Santa Fe Colonial (SanCOL)', tipo: 'hosteria',
    title: 'Hotel y Spa Santa Fe Colonial (SanCOL) — Spa, Piscina y Todo Incluido',
    desc: 'SanCOL: Hotel y Spa en el centro histórico de Santa Fe de Antioquia. Piscinas, spa, plan todo incluido. Reserva directa.',
    h1: 'Hotel y Spa Santa Fe Colonial — Relax y Bienestar en el Centro Histórico',
    description: 'El Hotel y Spa Santa Fe Colonial, conocido como SanCOL, es una experiencia única en el corazón del centro histórico. Combina el confort de un hotel boutique con un spa completo, piscinas y planes todo incluido. Ideal para parejas y quienes buscan una escapada de bienestar.',
    precio: 'Desde $180.000 por persona',
    ubicacion: 'Centro Histórico, Santa Fe de Antioquia',
    amenities: 'Spa,Piscina,Todo incluido,Jacuzzi,Restaurante,Boutique,Centro histórico',
    imagenes: 'sancol-01,sancol-02,sancol-03,sancol-04,sancol-05',
    faq: '¿Qué tratamientos ofrece el spa de SanCOL?|Ofrece masajes, tratamientos faciales y corporales, y zonas húmedas con jacuzzi. Consulta la carta completa.|¿Es solo para parejas?|Es ideal para parejas pero también reciben huéspedes individuales y grupos pequeños.|¿Está en el centro histórico?|Sí, está ubicado en pleno centro histórico, a pocos pasos de la Plaza Mayor y la Catedral.' },

  { slug: 'finca-hotel-tropical-palser', nombre: 'Finca Hotel Tropical PalSer', tipo: 'hosteria',
    title: 'Finca Hotel Tropical PalSer Santa Fe de Antioquia — Resort y Naturaleza',
    desc: 'Finca Hotel Tropical PalSer: tipo resort con privacidad total, naturaleza y confort. Desde $490.000 la noche en Santa Fe de Antioquia.',
    h1: 'Finca Hotel Tropical PalSer — Resort de Lujo en Santa Fe de Antioquia',
    description: 'La Finca Hotel Tropical PalSer es la opción más exclusiva de Santa Fe de Antioquia. Un resort privado rodeado de naturaleza, con habitaciones de lujo, servicio personalizado y una experiencia de desconexión total. Ideal para escapadas románticas y celebraciones especiales.',
    precio: 'Desde $490.000 por noche',
    ubicacion: 'Vereda cercana, Santa Fe de Antioquia',
    amenities: 'Piscina,Resort,Naturaleza,Privacidad,Lujo,Servicio personalizado',
    imagenes: 'palser-01,palser-02,palser-03,palser-04,palser-05',
    faq: '¿Por qué es más costoso que otras opciones?|PalSer es un resort de lujo con servicio personalizado, privacidad total e instalaciones premium. La experiencia justifica el precio.|¿Es apto para eventos?|Sí, es ideal para bodas y celebraciones íntimas. Consulta disponibilidad con anticipación.|¿Cuántas personas puede alojar?|Consulta la capacidad directamente con el hotel, ya que varía según el tipo de reserva.' },

  { slug: 'hotel-mariscal-robledo', nombre: 'Hotel Mariscal Robledo', tipo: 'hotel',
    title: 'Hotel Mariscal Robledo Santa Fe de Antioquia — #1 en TripAdvisor 4.7★',
    desc: 'Hotel Mariscal Robledo: #1 en TripAdvisor con 4.7 estrellas. Arquitectura colonial, piscina, spa y restaurante gourmet en el centro histórico.',
    h1: 'Hotel Mariscal Robledo — El Mejor Hotel de Santa Fe de Antioquia',
    description: 'El Hotel Mariscal Robledo es el establecimiento mejor valorado de Santa Fe de Antioquia, con 4.7 estrellas en TripAdvisor. Ubicado en una casona colonial restaurada en pleno centro histórico, ofrece piscina, spa, restaurante gourmet y un servicio impecable. La experiencia definitiva en el occidente antioqueño.',
    precio: 'Desde $320.000 por noche',
    ubicacion: 'Centro Histórico, Santa Fe de Antioquia',
    amenities: 'Piscina,Spa,Restaurante gourmet,Colonial,Suites,Jacuzzi,#1 TripAdvisor',
    imagenes: 'mariscal-robledo-05',
    faq: '¿Por qué es el #1 en TripAdvisor?|Por su arquitectura colonial impecable, servicio personalizado, restaurante gourmet y ubicación privilegiada en el centro histórico.|¿Tiene piscina?|Sí, cuenta con piscina rodeada de jardines coloniales.|¿Es apto para familias?|Sí, pero es especialmente recomendado para parejas y viajeros que buscan una experiencia de alto nivel.' },

  { slug: 'hotel-porton-del-sol', nombre: 'Hotel Portón del Sol', tipo: 'hotel',
    title: 'Hotel Portón del Sol Santa Fe de Antioquia — 60 Habitaciones y Piscina',
    desc: 'Hotel Portón del Sol: el de mayor capacidad en Santa Fe. 60 habitaciones, 16 suites, piscina y espacios para eventos.',
    h1: 'Hotel Portón del Sol — El Más Grande de Santa Fe de Antioquia',
    description: 'El Hotel Portón del Sol es el establecimiento con mayor capacidad de Santa Fe de Antioquia. Con 60 habitaciones, 16 suites, piscina, restaurante y amplios espacios para eventos sociales y corporativos. La opción ideal para grupos grandes y celebraciones.',
    precio: 'Desde $250.000 por noche',
    ubicacion: 'Entrada del municipio, Santa Fe de Antioquia',
    amenities: 'Piscina,60 habitaciones,16 suites,Eventos,Restaurante,Parqueadero',
    imagenes: 'porton-del-sol-01,porton-del-sol-02,porton-del-sol-03,porton-del-sol-04,porton-del-sol-05',
    faq: '¿Cuál es el hotel más grande de Santa Fe de Antioquia?|El Hotel Portón del Sol, con 60 habitaciones y 16 suites, es el de mayor capacidad del municipio.|¿Aceptan eventos corporativos?|Sí, cuenta con salones y espacios para eventos empresariales, convenciones y capacitaciones.|¿Tiene piscina?|Sí, tiene piscina para huéspedes y amplias zonas comunes.' },

  { slug: 'hotel-santa-fe-del-parque', nombre: 'Hotel Santa Fe del Parque', tipo: 'hotel',
    title: 'Hotel Santa Fe del Parque Santa Fe de Antioquia — Económico y Central',
    desc: 'Hotel Santa Fe del Parque: la opción más económica del centro. Frente al Parque Principal. Desde $80.000 la noche.',
    h1: 'Hotel Santa Fe del Parque — Frente al Parque Principal de Santa Fe de Antioquia',
    description: 'El Hotel Santa Fe del Parque es la opción más económica y mejor ubicada del centro histórico. A pocos pasos del Parque Principal, la Catedral y los principales atractivos. Habitaciones cómodas, atención amable y la mejor relación calidad-precio de Santa Fe de Antioquia.',
    precio: 'Desde $80.000 por noche',
    ubicacion: 'Frente al Parque Principal, Santa Fe de Antioquia',
    amenities: 'Económico,Central,WiFi,Cómodo',
    imagenes: 'santa-fe-parque-01,santa-fe-parque-02,santa-fe-parque-03,santa-fe-parque-04,santa-fe-parque-05',
    faq: '¿Es el más económico de Santa Fe?|Es uno de los más económicos del centro histórico, con habitaciones desde $80.000 la noche.|¿Tiene parqueadero?|Consulta disponibilidad de parqueadero al reservar, ya que es limitado en el centro histórico.|¿Incluye desayuno?|Algunas tarifas incluyen desayuno. Confirma al momento de reservar.' },

  { slug: 'hotel-santa-barbara-colonial', nombre: 'Hotel Santa Barbara Colonial', tipo: 'hotel',
    title: 'Hotel Santa Barbara Colonial Santa Fe de Antioquia — Colonial y Económico',
    desc: 'Hotel Santa Barbara Colonial: alojamiento colonial económico en el centro histórico de Santa Fe de Antioquia. Desde $95.000.',
    h1: 'Hotel Santa Barbara Colonial — Encanto Colonial en Santa Fe de Antioquia',
    description: 'El Hotel Santa Barbara Colonial ofrece la experiencia de alojarse en una casona colonial del centro histórico a precios accesibles. Con habitaciones alrededor de un patio interior típico antioqueño, desayuno incluido y atención familiar. Una experiencia auténtica.',
    precio: 'Desde $95.000 por noche',
    ubicacion: 'Centro Histórico, Santa Fe de Antioquia',
    amenities: 'Colonial,Económico,Desayuno,Céntrico,WiFi',
    imagenes: 'santa-barbara-01,santa-barbara-02,santa-barbara-03,santa-barbara-04,santa-barbara-05',
    faq: '¿Es realmente una casa colonial?|Sí, es una casona colonial restaurada con el encanto de la arquitectura tradicional antioqueña.|¿Incluye desayuno?|Sí, la mayoría de tarifas incluyen desayuno típico.|¿Está en el centro?|Sí, está en pleno centro histórico, a pocas calles de la Plaza Mayor.' },

  { slug: 'hotel-la-iguana', nombre: 'Hotel La Iguana de Santa Fe de Antioquia', tipo: 'hotel',
    title: 'Hotel La Iguana Santa Fe de Antioquia — Encanto y Comodidad',
    desc: 'Hotel La Iguana de Santa Fe de Antioquia: hotel con encanto, cómodo y bien ubicado. Reserva directa al mejor precio.',
    h1: 'Hotel La Iguana — Encanto Tropical en Santa Fe de Antioquia',
    description: 'El Hotel La Iguana de Santa Fe de Antioquia es un alojamiento lleno de encanto y personalidad. Con habitaciones cómodas, jardines tropicales y una atención cálida, es una excelente opción para viajeros que buscan una experiencia auténtica en el occidente antioqueño.',
    precio: 'Desde $90.000 por noche',
    ubicacion: 'Santa Fe de Antioquia, Antioquia',
    amenities: 'Jardines,Cómodo,WiFi,Encanto tropical',
    imagenes: 'iguana-01,iguana-02,iguana-03,iguana-04,iguana-05',
    faq: '¿Tiene piscina?|No cuenta con piscina propia, pero su ubicación permite fácil acceso a hosterías con piscina y día de sol cercanas.|¿Es buena opción económica?|Sí, con tarifas desde $90.000 es una opción cómoda y accesible en Santa Fe de Antioquia.' },

  { slug: 'casa-hotel-guaracu', nombre: 'Casa Hotel Guaracú', tipo: 'hotel',
    title: 'Casa Hotel Guaracú Santa Fe de Antioquia — Bicicletas Gratis y Piscina',
    desc: 'Casa Hotel Guaracú: hotel boutique con bicicletas gratis, piscina y desayuno incluido. Experiencia auténtica en Santa Fe de Antioquia.',
    h1: 'Casa Hotel Guaracú — Boutique con Bicicletas en Santa Fe de Antioquia',
    description: 'Casa Hotel Guaracú es un hotel boutique que ofrece una experiencia diferente en Santa Fe de Antioquia. Sus bicicletas gratuitas te permiten recorrer el pueblo y sus alrededores, y su piscina y desayuno incluido completan una estadía perfecta.',
    precio: 'Desde $180.000 por noche',
    ubicacion: 'Centro, Santa Fe de Antioquia',
    amenities: 'Bicicletas gratis,Piscina,Desayuno,Boutique,WiFi',
    imagenes: 'guaracu-01,guaracu-02,guaracu-03,guaracu-04',
    faq: '¿Las bicicletas son realmente gratis?|Sí, Casa Hotel Guaracú ofrece bicicletas sin costo adicional para que recorras el pueblo.|¿Incluye desayuno?|Sí, el desayuno está incluido en la tarifa.|¿Es un hotel boutique?|Sí, es pequeño, con atención personalizada y un ambiente acogedor diferente a los hoteles grandes.' },

  { slug: 'nueva-granada-hotel-colonial', nombre: 'Nueva Granada Hotel Colonial', tipo: 'hotel',
    title: 'Nueva Granada Hotel Colonial Santa Fe de Antioquia — 4.2★ TripAdvisor',
    desc: 'Nueva Granada Hotel Colonial: 4.2 estrellas en TripAdvisor. Arquitectura colonial en el centro histórico de Santa Fe de Antioquia.',
    h1: 'Nueva Granada Hotel Colonial — Historia y Confort en el Centro Histórico',
    description: 'El Nueva Granada Hotel Colonial es uno de los hoteles mejor valorados de Santa Fe de Antioquia con 4.2 estrellas en TripAdvisor. Su arquitectura colonial restaurada, ubicación en el centro histórico y atención personalizada lo convierten en una opción sobresaliente para tu estadía.',
    precio: 'Desde $190.000 por noche',
    ubicacion: 'Centro Histórico, Santa Fe de Antioquia',
    amenities: 'Colonial,Centro histórico,4.2★ TripAdvisor,WiFi,Desayuno',
    imagenes: 'nueva-granada-02,nueva-granada-03,nueva-granada-04,nueva-granada-05',
    faq: '¿Qué puntuación tiene en TripAdvisor?|Tiene 4.2 estrellas en TripAdvisor, siendo uno de los mejores valorados de Santa Fe de Antioquia.|¿Es colonial?|Sí, está ubicado en una casona colonial restaurada en pleno centro histórico.|¿Incluye desayuno?|Consulta la tarifa al reservar, algunas incluyen desayuno.' },

  { slug: 'selva-maria-hotel-boutique', nombre: 'Selva María Hotel Boutique', tipo: 'hotel',
    title: 'Selva María Hotel Boutique Santa Fe de Antioquia — Exclusividad y Confort',
    desc: 'Selva María Hotel Boutique: alojamiento exclusivo de alta calidad en Santa Fe de Antioquia. Experiencia boutique única.',
    h1: 'Selva María Hotel Boutique — Exclusividad en Santa Fe de Antioquia',
    description: 'Selva María Hotel Boutique ofrece una experiencia de alojamiento exclusiva y de alta calidad en Santa Fe de Antioquia. Con pocas habitaciones, atención ultra personalizada y un ambiente íntimo, es la elección perfecta para viajeros exigentes que buscan algo diferente.',
    precio: 'Desde $210.000 por noche',
    ubicacion: 'Santa Fe de Antioquia, Antioquia',
    amenities: 'Boutique,Exclusivo,Personalizado,WiFi',
    imagenes: 'selva-maria-01,selva-maria-02,selva-maria-03,selva-maria-04',
    faq: '¿Qué significa hotel boutique?|Es un hotel pequeño, con pocas habitaciones, atención ultra personalizada y un diseño único.|¿Es apto para familias?|Por su ambiente íntimo, es más recomendado para parejas y viajeros individuales.|¿Tiene piscina?|Consulta las instalaciones directamente con el hotel.' }
];

function buildPage(est) {
  const imgList = est.imagenes.split(',');
  const faqPairs = est.faq.split('|');
  const faqs = [];
  for (let i = 0; i < faqPairs.length; i += 2) {
    faqs.push({ q: faqPairs[i], a: faqPairs[i+1] });
  }

  const imgGallery = imgList.map((img, i) => {
    const extraClass = i === 0 ? '' : (i % 2 === 0 ? ` style="transform:rotate(-9deg);margin-top:-22.5%"` : ` style="transform:rotate(9deg);margin-top:-22.5%"`);
    return `      <div class="tour-img-item"${extraClass}>
        <img src="assets/images/${img.trim()}.webp" alt="${est.nombre} — Foto ${i+1}" loading="${i === 0 ? 'eager' : 'lazy'}">
      </div>`;
  }).join('\n');

  const amenitiesList = est.amenities.split(',').map(a => `          <li>${a.trim()}</li>`).join('\n');

  const faqHTML = faqs.map((f, i) => `
      <div class="faq-item">
        <button class="faq-trigger" aria-expanded="false">${f.q}</button>
        <div class="faq-answer" aria-hidden="true">
          <p>${f.a}</p>
        </div>
      </div>`).join('\n');

  const faqSchemaItems = faqs.map(f => 
    `    {"@type": "Question", "name": "${f.q.replace(/"/g, '\\"')}", "acceptedAnswer": {"@type": "Answer", "text": "${f.a.replace(/"/g, '\\"')}"}}`
  ).join(',\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${est.title}</title>
  <meta name="description" content="${est.desc}">
  <link rel="canonical" href="https://hosteriassantafe.com/${est.slug}.html">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://hosteriassantafe.com/${est.slug}.html">
  <meta property="og:title" content="${est.title}">
  <meta property="og:description" content="${est.desc}">
  <meta property="og:image" content="https://hosteriassantafe.com/assets/images/${imgList[0].trim()}.webp">
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
    "@type": "${est.tipo === 'hosteria' ? 'Hotel' : 'Hotel'}",
    "name": "${est.nombre}",
    "description": "${est.desc}",
    "url": "https://hosteriassantafe.com/${est.slug}.html",
    "address": { "@type": "PostalAddress", "addressLocality": "Santa Fe de Antioquia", "addressRegion": "Antioquia", "addressCountry": "CO" },
    "geo": { "@type": "GeoCoordinates", "latitude": "6.5565", "longitude": "-75.8267" },
    "priceRange": "$$",
    "amenityFeature": [${est.amenities.split(',').map(a => `{"@type":"LocationFeatureSpecification","name":"${a.trim()}","value":true}`).join(',')}]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Inicio","item":"https://hosteriassantafe.com/"},
      {"@type":"ListItem","position":2,"name":"${est.tipo === 'hosteria' ? 'Hosterías' : 'Hoteles'}","item":"https://hosteriassantafe.com/${est.tipo === 'hosteria' ? 'hosterias' : 'hoteles'}.html"},
      {"@type":"ListItem","position":3,"name":"${est.nombre}"}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${faqSchemaItems}
    ]
  }
  </script>
</head>
<body class="has-top-bar">

<div class="top-bar" role="banner">
  <a href="https://wa.me/573170000000?text=Hola,%20quiero%20consultar%20sobre%20${encodeURIComponent(est.nombre)}%20en%20Santa%20Fe%20de%20Antioquia" class="top-bar-wa" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
    Cotiza por WhatsApp
  </a>
  <div class="top-bar-socials"><a href="#" aria-label="Instagram">Instagram</a><a href="#" aria-label="Facebook">Facebook</a></div>
</div>

<header class="field-header" id="header">
  <div style="display:flex;align-items:center;">
    <button class="hamburger-btn" aria-label="Abrir menú" aria-expanded="false">
      <svg viewBox="0 0 32 24" width="32" height="24" fill="none"><line x1="0" y1="6" x2="32" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-line h-line-top"/><line x1="0" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-line h-line-bottom"/></svg>
    </button>
  </div>
  <a href="index.html" class="header-logo" aria-label="Inicio"><div class="logo-placeholder">HOSTERÍAS<br>SFA</div></a>
  <div class="header-socials"><a href="#" class="social-icon" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a></div>
</header>

<nav class="mobile-menu" id="mobile-menu" aria-label="Menú principal">
  <ul class="nav-items">
    <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
    <li class="nav-item"><a class="nav-link active" href="hosterias.html">Hosterías</a></li>
    <li class="nav-item"><a class="nav-link" href="hoteles.html">Hoteles</a></li>
    <li class="nav-item"><a class="nav-link" href="dia-de-sol.html">Día de Sol</a></li>
    <li class="nav-item"><a class="nav-link" href="que-hacer.html">Qué Hacer</a></li>
    <li class="nav-item"><a class="nav-link" href="como-llegar.html">Cómo Llegar</a></li>
    <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
    <li class="nav-item"><a class="nav-link" href="contacto.html">Contacto</a></li>
  </ul>
</nav>

<section class="field-breadcrumb">
  <img class="bc-bg" src="assets/images/${imgList[0].trim()}.webp" alt="${est.nombre} en Santa Fe de Antioquia" loading="eager">
  <div class="bc-overlay"></div>
  <div class="bc-content">
    <nav class="bc-nav" aria-label="Migas de pan">
      <a href="index.html">Inicio</a><span class="sep">›</span>
      <a href="${est.tipo === 'hosteria' ? 'hosterias' : 'hoteles'}.html">${est.tipo === 'hosteria' ? 'Hosterías' : 'Hoteles'}</a><span class="sep">›</span>
      <span>${est.nombre}</span>
    </nav>
    <h1 class="bc-title">${est.h1}</h1>
  </div>
</section>

<section class="tour-detail-wrap">
  <div class="tour-detail-grid">
    <div class="tour-img-stack" data-animate>
${imgGallery}
    </div>

    <div class="tour-info-grid" data-animate data-delay="1">
      <h2 class="tour-info-title">${est.nombre}<br>Ficha Completa</h2>
      <div class="include-list">
        <h6>Servicios y Amenidades</h6>
        <ul>
${amenitiesList}
        </ul>
      </div>
      <div class="include-list">
        <h6>Información</h6>
        <ul>
          <li>${est.precio}</li>
          <li>${est.ubicacion}</li>
          <li>Temperatura promedio: 26°C</li>
          <li>78 km de Medellín (1h45)</li>
        </ul>
      </div>
      <div style="grid-column:1/-1;margin-top:var(--space-sm);">
        <p class="section-subtitle" style="margin-bottom:var(--space-md);">${est.description}</p>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;">
          <button class="btn btn-primary" data-wa-trigger data-wa-establecimiento="${est.nombre}" style="cursor:pointer;">
            <div class="btn-bg"></div>
            <svg class="compass-icon" viewBox="0 0 68 68" fill="none" aria-hidden="true"><circle cx="34" cy="34" r="31" stroke="#0A0A0A" stroke-width="1.5"/><path d="M34 7 L29.5 30 L34 27 L38.5 30 Z" fill="#0A0A0A"/><path d="M34 61 L38.5 38 L34 41 L29.5 38 Z" fill="#0A0A0A" opacity=".4"/><path d="M7 34 L30 38.5 L27 34 L30 29.5 Z" fill="#0A0A0A" opacity=".4"/><path d="M61 34 L38 29.5 L41 34 L38 38.5 Z" fill="#0A0A0A"/><circle cx="34" cy="34" r="4" fill="#0A0A0A"/></svg>
            <span>Verificar Disponibilidad</span>
          </button>
          <a href="https://wa.me/573170000000?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20${encodeURIComponent(est.nombre)}" class="btn btn-dark">
            <div class="btn-bg"></div>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="faq-section">
  <div class="faq-inner">
    <div class="text-center" style="margin-bottom:var(--space-lg);">
      <p class="section-tag" style="justify-content:center;">${est.nombre}</p>
      <h2 class="section-title text-center" data-animate>Preguntas Frecuentes</h2>
    </div>
    <div class="faq-list" data-acc-group="faq-establishment">
${faqHTML}
    </div>
  </div>
</section>

<div class="cta-banner">
  <div class="container">
    <h3>¿Listo para visitar ${est.nombre}?</h3>
    <p>Verifica disponibilidad ahora. Sin costo, sin intermediarios. Te conectamos directamente.</p>
    <button class="btn btn-dark" data-wa-trigger data-wa-establecimiento="${est.nombre}" style="cursor:pointer;font-size:var(--body-lg);padding:1rem 2rem;">
      <div class="btn-bg"></div>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
      <span>Verificar Disponibilidad</span>
    </button>
  </div>
</div>

<footer class="field-footer" role="contentinfo">
  <svg class="footer-deco" viewBox="0 0 1440 200" fill="none" aria-hidden="true"><path class="svg-draw" d="M0 80 Q360 160 720 80 Q1080 0 1440 80" stroke="#0A0A0A" stroke-width="2.5" fill="none"/></svg>
  <div class="footer-grid">
    <div class="footer-logo-wrap" data-animate>
      <div class="footer-logo-text">HOSTERÍAS</div>
      <div class="footer-logo-sub">Santa Fe de Antioquia</div>
      <p style="font-size:var(--body-sm);color:rgba(0,0,0,.55);margin-top:var(--space-md);line-height:1.7;max-width:280px;">Tu guía de confianza para encontrar la hostería o hotel perfecto. Reserva directa al mejor precio.</p>
    </div>
    <div class="footer-testimonial" data-animate data-delay="1">
      <div class="swiper swiper-testimonials">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><p class="testimonial-quote">"Excelente servicio y atención. Reservamos directo con ${est.nombre} y nos atendieron de maravilla."</p><div class="testimonial-author">Visitante satisfecho</div><div class="testimonial-role">Santa Fe de Antioquia</div></div>
          <div class="swiper-slide"><p class="testimonial-quote">"La experiencia más auténtica que hemos tenido. La comida, la piscina y el trato humano superaron nuestras expectativas."</p><div class="testimonial-author">Familia Gómez</div><div class="testimonial-role">Medellín, Colombia</div></div>
          <div class="swiper-slide"><p class="testimonial-quote">"Tres días que parecieron tres semanas de paz. Sin duda volveremos pronto."</p><div class="testimonial-author">Carlos Méndez</div><div class="testimonial-role">Bogotá, Colombia</div></div>
        </div>
      </div>
      <div class="footer-swiper-nav"><button class="footer-nav-btn footer-prev" aria-label="Anterior"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button><button class="footer-nav-btn footer-next" aria-label="Siguiente"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button></div>
    </div>
  </div>
</footer>
<div class="footer-bottom"><p>© 2026 Hosterías Santa Fe de Antioquia | <a href="contacto.html">Contacto</a> | <a href="politica-privacidad.html">Privacidad</a> | <a href="habeas-data.html">Habeas Data</a> | <a href="terminos.html">Términos</a></p></div>

<div class="floating-ctas">
  <a href="#" class="float-btn float-wa" aria-label="WhatsApp" data-wa-trigger data-wa-establecimiento="${est.nombre}">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
  </a>
  <a href="tel:+573170000000" class="float-btn float-call" aria-label="Llamar">
    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  </a>
</div>

<!-- MODAL DISPONIBILIDAD -->
${modalHTML}

<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>`;
}

// Read modal HTML
const modalHTML = fs.readFileSync(path.join(BASE, '_modales', '_modal-disponibilidad.html'), 'utf8');

// Generate all pages
for (const est of ESTABLECIMIENTOS) {
  const filePath = path.join(BASE, `${est.slug}.html`);
  const html = buildPage(est);
  fs.writeFileSync(filePath, html);
  console.log(`✅ ${est.slug}.html (${html.split('\n').length} lines)`);
}

console.log(`\n🎉 Generated ${ESTABLECIMIENTOS.length} individual pages`);
