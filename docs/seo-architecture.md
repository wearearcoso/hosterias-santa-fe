# Arquitectura SEO y captación — Hosterías Santa Fe

Estado: propuesta aplicada a las seis URL del MVP en staging, 2 de octubre de 2026. **No habilitar indexación todavía.** El dominio final, los derechos de imagen y la entrega real del formulario siguen pendientes según `docs/launch-review-2026-10-02.md`.

## Fuentes y criterio

- Inventario autorizado: cinco establecimientos de `src/data/properties.js`. Nombre, tipo, sector y enlaces de origen son los únicos datos de ficha publicados como hechos. Fotografías con derechos `pending` en `src/data/image-rights.json`.
- Demanda: `KW Research Hosterias Santa Fe de Antioquia.csv`, `Ideas KW Hosterias Santa Fe de Antioquia.csv` e `Ideas 2 KW Hosterias Santa fe de Antioquia.csv`. Las cifras son las estimaciones de esos archivos, no tráfico esperado. Las variantes con 2.900 búsquedas pueden compartir clúster; no se suman.
- Se intentó consultar el skill `notebooklm` mediante `scripts/run.py`; la sesión guardada tenía 104 días y la navegación terminó en timeout. Esta arquitectura se fundamenta en los CSV y datos del repositorio, sin atribuir conclusiones al cuaderno.
- Cada URL debe resolver una intención distinta y mostrar información propia. No abrir una categoría por tener volumen si la selección o la oferta no se puede demostrar.

## Árbol de URL ahora

```text
/                              Comparación general de hosterías y hoteles
├── /hosteria-florida-tropical   Navegación de marca
├── /hosteria-fundadores         Navegación de marca
├── /hotel-mariscal-robledo      Navegación de marca
├── /hotel-porton-del-sol        Navegación de marca
└── /hotel-la-iguana             Navegación de marca
```

El `sitemap.xml` incluye exclusivamente estas seis URL. Las doce rutas heredadas se redirigen temporalmente al inicio en `functions/_middleware.js`, quedan `noindex` y no se enlazan desde el catálogo. No indexar contenido de categorías heredadas sin depurarlo y demostrar la oferta correspondiente.

## Mapa por página

| URL | Intención y consultas objetivo | Title actual | H1 actual | Descripción y contenido distintivo | Próximo dato necesario |
| --- | --- | --- | --- | --- | --- |
| `/` | Comparación comercial: `hosterías en Santa Fe de Antioquia`, `hoteles en Santa Fe de Antioquia` (2.900 cada grupo de variantes); apoyo: `hospedaje Santa Fe de Antioquia` (320), `alojamiento Santa Fe de Antioquia` (70) | Hosterías y hoteles en Santa Fe de Antioquia \| Explora 5 opciones | Hosterías y hoteles en Santa Fe de Antioquia | Cinco fichas enlazadas, ubicación indicada, flujo de consulta y criterios útiles para elegir. Una sola URL para ambas palabras principales porque el catálogo y la intención son los mismos. | Fotos con permiso, atributos verificables y respuesta real a leads. |
| `/hosteria-florida-tropical` | Búsqueda de marca: Hostería Florida Tropical + localidad | Hostería Florida Tropical \| Santa Fe de Antioquia | Hostería Florida Tropical en Santa Fe de Antioquia | Tipo hostería, ubicación general, carácter campestre indicado en catálogo y pregunta de traslado/servicios; enlace al sitio del establecimiento. | Dirección exacta, condiciones, servicios y fotos propios confirmados. |
| `/hosteria-fundadores` | Búsqueda de marca: Hostería Los Fundadores + localidad | Hostería Los Fundadores \| Santa Fe de Antioquia | Hostería Los Fundadores en Santa Fe de Antioquia | Dirección indicada Carrera 13 No. 16-23; pregunta sobre acceso y condiciones; enlace al sitio del establecimiento. | Confirmación actual de dirección, servicios y fotos propios. |
| `/hotel-mariscal-robledo` | Búsqueda de marca: Hotel Mariscal Robledo + localidad | Hotel Mariscal Robledo \| Santa Fe de Antioquia | Hotel Mariscal Robledo en Santa Fe de Antioquia | Dirección indicada Carrera 12 # 9-70, Centro Histórico; pregunta de acceso y servicios; enlace al sitio del establecimiento. | Confirmación de servicios, condiciones y fotos propios. |
| `/hotel-porton-del-sol` | Búsqueda de marca: Hotel Portón del Sol + localidad | Hotel Portón del Sol \| Santa Fe de Antioquia | Hotel Portón del Sol en Santa Fe de Antioquia | Ubicación general y solicitud explícita de dirección exacta, ocupación y condiciones; enlace al sitio del establecimiento. | Dirección exacta, servicios y fotos propios confirmados. |
| `/hotel-la-iguana` | Búsqueda de marca: Hotel Iguana + localidad | Hotel Iguana \| Santa Fe de Antioquia | Hotel Iguana en Santa Fe de Antioquia | Ubicación general, verificación de dirección y condiciones de habitación; enlace a la página del establecimiento. | Dirección exacta, servicios y fotos propios confirmados. |

Las meta descriptions de cada ficha ahora corresponden a su información propia. Los títulos no afirman “mejor”, “económico”, “con piscina”, “todo incluido” ni disponibilidad. Cada ficha tiene un H1 único, un enlace al catálogo, dos enlaces contextuales a otras fichas y una consulta asociada al establecimiento. La portada enlaza las cinco fichas. La navegación mantiene accesibles los avisos legales.

## Camino de conversión y medición

1. Entrada orgánica a portada o ficha de marca → comparación de información publicada → botón de consulta con propiedad preseleccionada → formulario.
2. El formulario debe fallar sin configuración real de GestionaLeads. Una solicitud enviada no es una reserva ni garantiza tarifa o disponibilidad.
3. Al preparar producción, configurar medición consentida de `view_item` o equivalente para ficha, clic de consulta y lead **solo cuando exista confirmación del CRM**; evitar registrar teléfonos y nombres en analítica. Separar consultas orgánicas de leads válidos y reservas confirmadas, si estas últimas se pueden atribuir.
4. En Search Console, comprobar consultas y páginas de entrada, cobertura de las seis URL, canonical elegido, sitemap y errores de rastreo. Ajustar copy con datos reales tras varias semanas; no convertir estimaciones de volumen en promesas de captación.

## Dominios, canonical, robots y sitemap

- En staging, los canonical y `og:url` señalan `https://hosterias-santa-fe.pages.dev` y el sitemap usa la misma base. Esto sirve para consistencia interna de la revisión; **pages.dev permanece noindex**. Además, `robots.txt` bloquea rastreo, `_headers` marca `noindex` y el middleware mantiene el bloqueo en pages.dev.
- Antes de indexar, elegir el dominio final, decidir www o sin www, fijar HTTPS y redirección 301 del host alterno. Cambiar conjuntamente canonical, `og:url`, sitemap y `robots.txt`; comprobar cada URL final en vivo. No permitir que pages.dev compita con el dominio final.
- Tras cumplir los gates de lanzamiento, habilitar indexación solo en el dominio final y revisar respuesta HTTP, `X-Robots-Tag`, robots meta, canonical, sitemap, enlaces internos y redirecciones. Eliminar bloqueo de `robots.txt` únicamente al abrir producción.
- `lastmod` debe representar modificaciones sustanciales reales de cada página, no una fecha renovada por rutina. No incluir parámetros del formulario, rutas legales/temporales ni páginas de filtros sin contenido propio.

## Datos estructurados

No se añadieron `Hotel`, `LodgingBusiness`, `Offer`, `AggregateRating` ni `FAQPage`: faltan datos comerciales verificables y no deben reaparecer las afirmaciones antiguas. Tras fijar dominio, se puede añadir `BreadcrumbList` con URL y nombres de página visibles; `WebSite` solo con identidad del sitio comprobada. Si algún día se usa `Hotel`/`LodgingBusiness`, el marcado debe derivarse de datos publicados y respaldados (dirección, amenidades, fotos con derechos, contacto), sin inventar `priceRange`, valoraciones o disponibilidad. Validar que el JSON-LD describe exactamente el HTML visible.

## Módulo futuro de rangos orientativos

El rango de Booking se puede mostrar en cada ficha **solo después de** documentar permiso o base autorizada para publicar esa información, correspondencia inequívoca entre anuncio y establecimiento, fecha de observación reciente, ocupación, habitación, moneda, impuestos/cargos y condiciones comparables. La metodología y evidencias se especifican en `docs/booking-estimates.md`; observaciones crudas permanecen fuera del repositorio público. La interfaz implementada es `src/data/verified-rate-ranges.json`, ausente por defecto, creada únicamente por `node scripts/booking-estimates.mjs public` después de validar cada propiedad. Al crear el archivo, se regeneran las fichas; el módulo empieza oculto y `assets/js/verified-rates.js` solo muestra entradas `status: "ready"` antes de `expiresAt`; si el archivo falta, está vacío o vencido, no muestra ninguna cifra. Una captura o tarifa aislada no constituye un rango estable ni disponibilidad. Si la autorización o vigencia falta, mantener el dato para análisis interno y mostrar únicamente “Consulta tarifa vigente”.

Ubicación implementada cuando existe JSON válido: en cada una de las cinco fichas, después de “Conoce esta opción” y antes de “Confirma lo que importa para tu estancia”. Si el JSON existe, cada ficha contiene un módulo inicialmente oculto; solo se muestra donde haya entrada válida para esa propiedad. Copy visible: **“Rango orientativo verificado”** con importe, fechas comparadas, tipo de habitación, plan, impuestos y cargos obligatorios, base de la verificación y fecha de vigencia. Retirar automáticamente el rango si vence su período de vigencia o si cambian los supuestos. El CTA de lead no debe presentar el estimado como precio garantizado.

## Backlog de landings por prioridad

| Prioridad | Consulta local estimada | URL candidata | Gate antes de publicarla |
| --- | --- | --- | --- |
| 1 | `día de sol Santa Fe de Antioquia` (1.300) | `/dia-de-sol-santa-fe-de-antioquia` | Al menos una oferta de pasadía confirmada por establecimiento, qué incluye, horario, fechas, precio/consulta y condiciones; contenido original, no restaurar el HTML heredado. |
| 2 | `hoteles con piscina Santa Fe de Antioquia` (10) y variantes | `/hoteles-con-piscina-santa-fe-de-antioquia` | Piscina vigente confirmada para suficientes propiedades y selección útil; fotos con permisos. El volumen local de este CSV es pequeño. |
| 3 | `hosterías en Santa Fe de Antioquia económicas` (140 en Ideas 2), `hoteles baratos` (40) | `/hoteles-economicos-santa-fe-de-antioquia` | Tarifas comparables, vigentes y publicables; criterio explícito de “económico” y suficiente inventario. |
| 4 | `hotel todo incluido` (140), `hotel boutique` (110), `hotel colonial` (90), `glamping` (170), `hosterías para parejas` (40 en Ideas 2) | Landings separadas solo donde haya inventario | Clasificación, atributos y condiciones escritas por establecimiento; no abrir si ninguna de las cinco opciones corresponde. |
| 5 | `dónde hospedarse`, `planes` | `/guia-santa-fe-de-antioquia` | Guía local original, fuentes verificables, experiencia útil y mantenimiento editorial; evitar una página genérica creada solo para captar impresiones. |

Las prioridades reflejan interés observado y posibilidad de oferta; no implican que estas páginas estén listas. No sumar variantes como demanda independiente. La primera expansión comercial debería partir de una oferta validada de día de sol; hasta entonces la portada y las cinco fichas son el alcance SEO publicable tras completar el lanzamiento.
