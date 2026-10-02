# Briefs editoriales de expansión SEO — Santa Fe de Antioquia

Estado: **propuestas, no páginas publicadas** (2 de octubre de 2026). El sitio mantiene únicamente la portada y las cinco fichas aprobadas de `src/data/properties.js`. Ninguna de estas nueve rutas se añade a navegación, catálogo ni `sitemap.xml` hasta verificar inventario, oferta y fotos. Varias rutas heredadas siguen redirigidas temporalmente a `/` en `functions/_middleware.js`; al publicar alguna habrá que retirar solo su redirección y validar la URL real.

Fuentes de demanda: `KW Research Hosterias Santa Fe de Antioquia.csv`, `Ideas KW Hosterias Santa Fe de Antioquia.csv`, `Ideas 2 KW Hosterias Santa fe de Antioquia.csv` y el mapa `docs/seo-architecture.md`. Los volúmenes son estimaciones, no visitas ni leads esperados; no se suman variantes semejantes. Cada futura URL necesita contenido y selección propios para no repetir la portada.

## Orden de trabajo

1. **Día de sol**: preparar primero por intención comercial distinta del hospedaje nocturno y 1.300 búsquedas estimadas en el CSV. Validar planes, fechas, ámbito geográfico y permisos antes de publicar.
2. **Piscina y económicos**: requieren opciones comparables; «económico» necesita tarifas actuales, criterio de comparación y permiso de publicación.
3. **Todo incluido, boutique, coloniales, glamping y parejas**: abrir cada URL solo con establecimientos que correspondan realmente a esa categoría.
4. **Guía local**: requiere investigación original y utilidad independiente de la portada.

Los títulos son condicionales. «Opciones», «hoteles» u «hosterías» en plural requieren **al menos dos opciones verificadas y útiles**. Si día de sol cuenta solo con una oferta confirmada, el título y los H2 deben escribirse en singular. Ninguna foto con derechos `pending` prueba un servicio ni puede usarse como evidencia de la landing. Documentar identidad y permiso de uso en `src/data/image-rights.json`.

## 1. Día de sol

- **URL candidata:** `/dia-de-sol-santa-fe-de-antioquia`.
- **Intención:** comparar o consultar un plan de pasadía; consulta `día de sol Santa Fe de Antioquia` (1.300 estimados). No es una búsqueda de alojamiento nocturno.
- **`<title>` propuesto:** `Día de sol en Santa Fe de Antioquia | Opciones y condiciones`.
- **H1:** `Día de sol en Santa Fe de Antioquia`.
- **H2:** `Opciones confirmadas`; `Qué incluye cada plan`; `Horarios y condiciones`.
- **Evidencia mínima:** confirmación escrita y reciente de al menos un plan vigente por su operador; nombre, identidad, ubicación real, días y fechas, horario de entrada/salida, servicios incluidos/excluidos, restricciones, política para menores y forma de consultar valor vigente. Confirmar acceso a piscina antes de mencionarlo. Registrar fecha, responsable, fuente y fotos identificadas con permiso. Con una sola oferta, reescribir título y secciones en singular.
- **Hallazgos para verificar:** [Florida Tropical publica un día de sol](https://www.hosteriafloridatropical.com/dia-de-sol/) y [un plan especial](https://www.hosteriafloridatropical.com/planes-tarifas/dia-de-sol-especial/) con horario indicado de 8:00 a 17:00. Su [FAQ](https://www.hosteriafloridatropical.com/preguntas-frecuentes/) indica apertura regular de jueves a domingo y lunes festivos, dato que requiere conciliación con la tabla tarifaria. El establecimiento se presenta entre Sopetrán y Santa Fe de Antioquia: confirmar municipio y no describirlo como ubicado dentro de Santa Fe. [Los Fundadores publica planes](https://hosteriafundadores.com/planes/) con inclusiones y tarifas que datan de diciembre de 2025; confirmar vigencia y horario propio del día de sol, sin atribuirle el 9:00–15:00 de otro plan con habitación; su [FAQ](https://hosteriafundadores.com/f-a-q/) tampoco resuelve esta verificación. [Hotel Iguana](https://bernalohotels.com/hotel-iguana/) solo menciona el servicio; [Portón del Sol](https://www.hotelportondelsol.com.co/) lo menciona en un testimonio; las [promociones de Mariscal Robledo](https://www.hotelmariscalrobledo.com/es/promotions.html) no muestran oferta comprobada de día de sol. Esas menciones no constituyen inventario publicable.
- **Preguntas pendientes al operador:** ¿Existe hoy el plan de día de sol? ¿Qué días y fechas se ofrece? ¿Cuál es su horario exacto? ¿Qué incluye y excluye? ¿Dónde está ubicado el establecimiento? ¿Se puede publicar una descripción, fotos y, si aplica, condiciones comerciales? **Conclusión: esta URL aún no se publica.**
- **CTA futuro:** `Consultar un plan de día de sol` hacia el formulario; no sugerir cupo, reserva ni tarifa garantizados.

### Borrador editorial de día de sol — NO PUBLICAR

**Introducción.** Si buscas un plan de día de sol cerca de Santa Fe de Antioquia, compara primero la ubicación y las condiciones directamente confirmadas por cada hostería. Las páginas oficiales de Florida Tropical y Los Fundadores describen planes de este tipo; la disponibilidad y los detalles actuales requieren respuesta de cada operador.

**Florida Tropical.** La hostería se presenta entre Sopetrán y Santa Fe de Antioquia y publica información sobre [día de sol](https://www.hosteriafloridatropical.com/dia-de-sol/) y un [plan especial](https://www.hosteriafloridatropical.com/planes-tarifas/dia-de-sol-especial/). Antes de describirla como opción disponible, confirmar el municipio, las fechas operativas, las inclusiones y las condiciones vigentes.

**Los Fundadores.** La hostería publica [planes de día de sol](https://hosteriafundadores.com/planes/). Antes de mostrar una ficha comparativa, confirmar el horario específico de ese plan, sus inclusiones vigentes, restricciones y forma de consulta.

**Preguntas para la consulta.** ¿Para qué fecha y cuántas personas? ¿Viajan menores? ¿Buscan acceso a piscina o habitación? ¿Qué servicios necesitan incluidos? La respuesta del establecimiento debe confirmar qué plan corresponde a esas necesidades.

**CTA propuesto.** `Solicitar información de día de sol`. Texto de apoyo: `La consulta no confirma cupo, tarifa ni reserva`.

## 2. Hoteles con piscina

- **URL candidata:** `/hoteles-con-piscina-santa-fe-de-antioquia`.
- **Intención:** encontrar hoteles con acceso a piscina; `hotel con piscina Santa Fe de Antioquia` tiene 10 búsquedas estimadas en el CSV local.
- **`<title>` propuesto:** `Hoteles con piscina en Santa Fe de Antioquia | Opciones verificadas`.
- **H1:** `Hoteles con piscina en Santa Fe de Antioquia`.
- **H2:** `Hoteles confirmados`; `Acceso a la piscina`; `Condiciones de uso`.
- **Evidencia mínima:** al menos dos hoteles del inventario con confirmación escrita de piscina operativa y acceso para el tipo de huésped descrito; horarios, restricciones y si incluye solo alojamiento o también pasadía. Fotos identificadas y autorizadas. Una imagen provisional no acredita acceso vigente.
- **CTA futuro:** `Consultar condiciones de un hotel` con el establecimiento preseleccionado.

## 3. Hoteles económicos

- **URL candidata:** `/hoteles-economicos-santa-fe-de-antioquia`.
- **Intención:** comparar opciones de menor coste. `Ideas 2` estima 140 para `hosterías en santa fe de antioquia económicas`; si el inventario confirmado son hosterías, adaptar URL, título y H1.
- **`<title>` propuesto:** `Hoteles económicos en Santa Fe de Antioquia | Tarifas verificadas`.
- **H1:** `Hoteles económicos en Santa Fe de Antioquia`.
- **H2:** `Cómo definimos «económico»`; `Opciones comparables`; `Qué incluye la tarifa`.
- **Evidencia mínima:** dos o más hoteles con tarifas actuales comparables por fechas, ocupación, habitación, plan, impuestos y cargos; base escrita para publicar valores o rangos; umbral transparente de «económico» basado en esa muestra. El flujo manual y gate están en `docs/booking-estimates.md`. Fotos e identidad verificadas.
- **CTA futuro:** `Consultar tarifa vigente`, indicando dependencia de fechas y ocupación.

## 4. Todo incluido

- **URL candidata:** `/hoteles-todo-incluido-santa-fe-de-antioquia`.
- **Intención:** entender planes con servicios incluidos; `hotel todo incluido Santa Fe de Antioquia` registra 140 estimados.
- **`<title>` propuesto:** `Hoteles todo incluido en Santa Fe de Antioquia | Planes confirmados`.
- **H1:** `Hoteles todo incluido en Santa Fe de Antioquia`.
- **H2:** `Planes disponibles`; `Qué incluyen`; `Exclusiones y condiciones`.
- **Evidencia mínima:** al menos dos hoteles con planes vigentes denominados así o equivalentes, confirmados por escrito; comidas, bebidas, actividades, horarios, exclusiones, edades y fechas aplicables. Desayuno o piscina por sí solos no acreditan «todo incluido». Fotos autorizadas.
- **CTA futuro:** `Consultar condiciones del plan`.

## 5. Hoteles boutique

- **URL candidata:** `/hoteles-boutique-santa-fe-de-antioquia`.
- **Intención:** evaluar alojamientos de estilo boutique; `hotel boutique Santa Fe de Antioquia` registra 110 estimados.
- **`<title>` propuesto:** `Hoteles boutique en Santa Fe de Antioquia | Opciones confirmadas`.
- **H1:** `Hoteles boutique en Santa Fe de Antioquia`.
- **H2:** `Alojamientos confirmados`; `Características de cada opción`; `Ubicación`.
- **Evidencia mínima:** dos o más hoteles que se presenten como boutique en fuente propia o autoricen expresamente esa clasificación, con rasgos concretos y ubicación confirmada. No deducir la categoría de una foto. Fotos identificadas y autorizadas.
- **CTA futuro:** `Consultar una opción boutique`.

## 6. Hoteles coloniales

- **URL candidata:** `/hoteles-coloniales-santa-fe-de-antioquia`.
- **Intención:** buscar hospedaje en inmuebles o espacios de carácter colonial; `hotel colonial Santa Fe de Antioquia` registra 90 estimados.
- **`<title>` propuesto:** `Hoteles coloniales en Santa Fe de Antioquia | Guía de alojamientos`.
- **H1:** `Hoteles coloniales en Santa Fe de Antioquia`.
- **H2:** `Alojamientos verificados`; `Historia y características`; `Cómo elegir`.
- **Evidencia mínima:** dos o más hoteles con clasificación y atributos arquitectónicos confirmados por el operador. Toda historia, antigüedad o categoría patrimonial exige fuente documental propia o institucional; estar en el centro histórico no prueba protección patrimonial. Fotos autorizadas.
- **CTA futuro:** `Consultar un alojamiento`.

## 7. Glamping

- **URL candidata:** `/glamping-santa-fe-de-antioquia`.
- **Intención:** encontrar alojamiento de tipo glamping; `glamping Santa Fe de Antioquia` registra 170 estimados.
- **`<title>` propuesto:** `Glamping en Santa Fe de Antioquia | Opciones y condiciones`.
- **H1:** `Glamping en Santa Fe de Antioquia`.
- **H2:** `Opciones disponibles`; `Servicios e instalaciones`; `Condiciones de estancia`.
- **Evidencia mínima:** al menos dos opciones reales de glamping verificadas y autorizadas para el catálogo; ubicación, tipo de unidad, ocupación, servicios, acceso y condiciones confirmadas por cada operador. Ninguna de las cinco fichas actuales acredita glamping. Fotos identificadas y autorizadas.
- **CTA futuro:** `Consultar condiciones de una estancia`.

## 8. Hosterías para parejas

- **URL candidata:** `/hosterias-para-parejas-santa-fe-de-antioquia`.
- **Intención:** elegir una hostería para viajar en pareja; `Ideas 2` registra 40 estimados para `hosterías en santa fe de antioquia para parejas`.
- **`<title>` propuesto:** `Hosterías para parejas en Santa Fe de Antioquia | Opciones verificadas`.
- **H1:** `Hosterías para parejas en Santa Fe de Antioquia`.
- **H2:** `Opciones confirmadas`; `Qué ofrece cada estancia`; `Cómo consultar`.
- **Evidencia mínima:** dos o más hosterías con habitaciones o planes aptos para dos, condiciones actuales y atributos concretos confirmados. Evitar «romántica», «solo adultos» o «privada» sin prueba específica. Fotos autorizadas.
- **CTA futuro:** `Consultar estancia para dos`.

## 9. Guía local para elegir alojamiento

- **URL candidata:** `/guia-santa-fe-de-antioquia`.
- **Intención:** orientar la elección de zona y tipo de hospedaje antes de consultar. `dónde hospedarse en Santa Fe de Antioquia` aparece con volumen 0 en el CSV; su valor depende de utilidad editorial real, no de una promesa de tráfico.
- **`<title>` propuesto:** `Dónde hospedarse en Santa Fe de Antioquia | Guía para elegir`.
- **H1:** `Dónde hospedarse en Santa Fe de Antioquia`.
- **H2:** `Zonas para alojarse`; `Cómo comparar opciones`; `Preguntas antes de reservar`.
- **Evidencia mínima:** investigación original y fuentes verificables para zonas, ubicación, movilidad y distancias; fecha de revisión; enlaces a fichas que correspondan a cada descripción; contenido que no duplique la portada y fotos locales con derechos. No simular experiencia propia.
- **CTA futuro:** `Comparar las opciones confirmadas` hacia la portada o `Consultar una opción` hacia el formulario.

## Regla de publicación

Para cada landing: (1) registrar evidencia de inventario, oferta, atributos y fotos; (2) escribir contenido propio que satisfaga sus H2 y revisar el título; (3) enlazarla desde la portada o guía y enlazar de vuelta a las fichas pertinentes; (4) retirar su redirección temporal si existe, fijar canonical en el dominio final y comprobar HTTP 200; (5) añadirla al sitemap solo cuando esté terminada y autorizada para indexación; (6) registrar en el formulario y en el CRM el interés por el plan/categoría y el establecimiento elegido, sin éxito simulado; probar en móvil y desktop y verificar entrega real del lead. Mientras sigan pendientes dominio final, fotos y CRM, conservar staging `noindex`.
