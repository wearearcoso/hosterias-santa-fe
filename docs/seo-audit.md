# Auditoría SEO del MVP — 2 de octubre de 2026

## Alcance y fuentes

- Archivos locales: `KW Research Hosterias Santa Fe de Antioquia.csv`, `Ideas KW Hosterias Santa Fe de Antioquia.csv` e `Ideas 2 KW Hosterias Santa fe de Antioquia.csv`.
- Inventario autorizado: `src/data/properties.js` (cinco establecimientos). El manifiesto `src/data/image-rights.json` marca las fotografías como `pending`.
- Esta auditoría analiza el código de staging. No constituye un crawl del dominio de producción ni valida datos comerciales actuales de los establecimientos.
- Se intentó consultar el NotebookLM de Raanky según las instrucciones globales. Su sesión guardada tenía 104 días y la consulta falló por timeout; por ello el mapa de palabras clave se sustenta en los CSV locales, sin atribuirle conclusiones al cuaderno.

## Mapa de intención y URL

| Búsqueda local en CSV | Volumen mensual indicado | Intención | URL vigente o decisión |
| --- | ---: | --- | --- |
| `hosterías en Santa Fe de Antioquia` y variantes | 2.900 | Comparar alojamiento | `/` — foco principal del H1 y metadatos |
| `hoteles en Santa Fe de Antioquia` y variantes | 2.900 | Comparar alojamiento | `/` — mismo catálogo MVP; no crear otra página casi duplicada |
| `día de sol Santa Fe de Antioquia` | 1.300 | Buscar pasadía | Diferida: la antigua `/dia-de-sol-santa-fe-de-antioquia` está noindex y fuera del sitemap; requiere oferta y condiciones verificadas |
| `hospedaje Santa Fe de Antioquia` | 320 | Comparar alojamiento | Término secundario natural en la portada, sin URL duplicada |
| `glamping Santa Fe de Antioquia` | 170 | Modalidad específica | Diferida: el inventario de cinco no tiene glamping verificado |
| `hotel todo incluido Santa Fe de Antioquia` | 140 | Plan específico | Diferida: no hay plan y condiciones verificadas para afirmarlo |
| `hotel boutique Santa Fe de Antioquia` | 110 | Modalidad específica | Diferida: no hay clasificación verificada en el inventario MVP |
| `hotel colonial Santa Fe de Antioquia` | 90 | Modalidad específica | Diferida hasta verificar propiedades y contenido original |
| `hosterías económicas en Santa Fe de Antioquia` | 140 (Ideas 2) | Precio | Diferida: no hay tarifas verificadas ni criterio de “económica” |
| `hosterías en Santa Fe de Antioquia para parejas` | 40 (Ideas 2) | Tipo de viaje | Diferida: no hay atributos verificados que justifiquen selección |
| Nombres de las cinco propiedades | No medido | Navegación de marca | Fichas `/hosteria-florida-tropical`, `/hosteria-fundadores`, `/hotel-mariscal-robledo`, `/hotel-porton-del-sol`, `/hotel-la-iguana` |

Los volúmenes de variantes no se deben sumar: el proveedor puede agrupar consultas equivalentes. Tampoco son una previsión de tráfico o reservas.

## Correcciones aplicadas

1. La portada cubre los dos clústeres principales en el título, descripción y H1, con una propuesta de consulta sin prometer reservas ni tarifas.
2. Las cinco fichas del sitemap se reconstruyeron desde `src/data/properties.js`: nombre, tipo, sector, fuente del establecimiento y consulta. Se retiraron precios, reseñas, rankings, servicios, coordenadas y FAQ/Hotel JSON-LD sin evidencia.
3. La portada enlaza a las cinco fichas. Cada ficha enlaza a la portada, al sitio fuente del establecimiento y abre el mismo formulario de solicitud. Cada una tiene título, descripción y canonical absolutos propios.
4. El sitemap mantiene solo la portada y las cinco fichas autorizadas. Staging conserva `noindex` y bloqueo de rastreo según `AGENTS.md`.

## Impedimentos para habilitar indexación y lanzar

- **Dominio y canonicals:** el dominio definitivo no está fijado en este repositorio. Los canonical, Open Graph y sitemap apuntan a `hosterias-santa-fe.pages.dev`; deben regenerarse al dominio elegido y comprobar redirecciones HTTPS/www.
- **Bloqueo triple de staging:** `robots.txt` contiene `Disallow: /`; `_headers` envía `X-Robots-Tag: noindex`; las seis páginas del MVP tienen `<meta name="robots" content="noindex,nofollow">`. En el dominio final deben habilitarse juntos, tras aprobación. `functions/_middleware.js` también requiere `SEO_INDEXING_ENABLED=true` y mantiene pages.dev bloqueado.
- **Fotografías:** el manifiesto de derechos sigue `pending`. No usar las imágenes actuales en una publicación comercial hasta contar con permiso escrito y procedencia comprobada o reemplazos autorizados. Omitir `og:image` evita ampliar su uso social mientras sigue pendiente.
- **Formulario:** confirmar credenciales reales de GestionaLeads y una prueba de entrega con ID real antes de recibir solicitudes. El fallo por ausencia de configuración es el comportamiento correcto de staging.
- **Contenido de fichas:** las fichas son seguras para revisión, pero breves porque solo se verificó nombre, tipo y sector. Antes de indexarlas, recopilar texto original y datos de servicios, condiciones y fotografías con fuente y fecha.
- **Páginas antiguas:** las 12 páginas de categoría/guía permanecen en el repositorio, pero `functions/_middleware.js` redirige temporalmente sus URL al inicio y envía `X-Robots-Tag: noindex`. Antes del lanzamiento hay que comprobar estas respuestas en Cloudflare Pages y decidir si se reconstruyen con datos verificables o se retiran del artefacto.
- **Medición:** no se verificó Google Search Console ni un crawl del dominio final. Tras activar producción, enviar sitemap canónico y comprobar indexación, respuesta HTTP, canonicals y datos estructurados reales.


### Inventario exacto de páginas legacy fuera del MVP

Las siguientes **12 rutas** siguen presentes como HTML, pero la función de Pages redirige sus URL temporalmente al inicio, envía `noindex` y no figuran en `sitemap.xml`. Todas incluyen datos estructurados; varias muestran precios explícitos y otras afirman atributos de alojamiento sin verificación del inventario MVP. Su contenido no se ha depurado en este sprint. Las rutas de `servicios` y `tour-detalle` son placeholders técnicos, no páginas de contenido de este inventario.

| Ruta | Riesgo principal a depurar |
| --- | --- |
| `/dia-de-sol-santa-fe-de-antioquia` | Planes, condiciones y precios sin inventario autorizado |
| `/guia-santa-fe-de-antioquia` | Recomendaciones y referencias comerciales antiguas |
| `/hosterias-para-parejas-santa-fe-de-antioquia` | Clasificación por pareja sin atributos verificados |
| `/hoteles-boutique-santa-fe-de-antioquia` | Clasificación boutique sin evidencia |
| `/hoteles-cerca-parque-santa-fe-de-antioquia` | Proximidad al parque no documentada para el catálogo MVP |
| `/hoteles-coloniales-santa-fe-de-antioquia` | Clasificación colonial sin evidencia |
| `/hoteles-con-piscina-santa-fe-de-antioquia` | Piscinas sin verificación de servicios vigentes |
| `/hoteles-economicos-santa-fe-de-antioquia` | Precio y etiqueta económica sin tarifa vigente |
| `/hoteles-para-eventos-santa-fe-de-antioquia` | Capacidad y condiciones de eventos sin verificación |
| `/hoteles-para-familias-santa-fe-de-antioquia` | Servicios familiares sin verificación |
| `/hoteles-santa-fe-de-antioquia` | Listado anterior más amplio que cinco establecimientos aprobados |
| `/hoteles-todo-incluido-santa-fe-de-antioquia` | Inclusiones de plan sin condiciones verificadas |

**Estado SEO:** staging coherente para revisión; **no aprobado aún para indexación pública** por los bloqueos y evidencias pendientes anteriores.
