# Revisión de lanzamiento — Hosterías Santa Fe de Antioquia

Fecha: 2026-10-02. Rama de revisión: `codex/hosterias-launch-audit`. Referencia visual consultada: https://www.turaturizm.com/.

## Dictamen

**Diseño y responsive: aprobados para revisión en staging. Lanzamiento público e indexación: no aprobados todavía.** La portada y cinco fichas están preparadas para revisión visual; los controles de staging siguen activos. Las fotografías no tienen permiso ni identidad documentada, el dominio final/canonical no está fijado y no se ha verificado una entrega real del formulario al CRM. No se desplegó ni habilitó indexación.

## Comparación con Tura Turizm

| Rasgo de la referencia | Resultado del proyecto | Dictamen |
| --- | --- | --- |
| Hero inmersivo de ancho completo | Hero a pantalla completa con cabecera superpuesta | Alineado en composición |
| Marca centrada, menú lateral y CTA visible | Marca centrada, menú desplegable y CTA de consulta | Alineado; identidad propia |
| Titular protagonista y llamada a la acción en píldora | Titular central con intención SEO y botón dorado | Alineado |
| Secciones editoriales y exploración visual | Sección de cinco alojamientos y tarjetas fotográficas | Alineado para el MVP |
| Fotografía de destino auténtica | Hero de piscina genérica; cinco tarjetas sin identidad/permiso probados | Pendiente; no corresponde a la calidad final de referencia |

La referencia comunica una empresa de cruceros; se trasladaron patrones de composición y navegación, no su marca, contenido ni imágenes.

## SEO y contenido

- El H1/title de portada cubre las consultas principales del CSV local (variantes de hosterías y hoteles en Santa Fe de Antioquia, 2.900 según la fuente; no sumar variantes). Cinco fichas coinciden con el catálogo aprobado y con el sitemap.
- Se retiraron de las cinco fichas las tarifas, reseñas, servicios y datos estructurados no verificados. Doce rutas legacy con afirmaciones antiguas quedan fuera del sitemap y reciben redirección temporal a la portada con `noindex` desde el middleware de Pages. La redirección tiene prueba unitaria; comprobarla en Cloudflare antes del lanzamiento.
- El entorno actual conserva meta `noindex`, cabecera `X-Robots-Tag` y `robots.txt` bloqueado. Los canonical y el sitemap apuntan a pages.dev hasta elegir dominio final.
- Las páginas de intención específica del keyword research (pasadía, todo incluido, boutique, económicas y similares) se difieren hasta tener inventario, oferta y condiciones verificables. Ver `docs/seo-audit.md`.

## Fotografías

- Siete imágenes activas auditadas, cero archivos ausentes, siete permisos pendientes. Ninguna foto de tarjeta tiene identidad del establecimiento confirmada en el registro. El hero no identifica una de las cinco propiedades.
- `docs/photo-production.md` especifica cómo solicitar originales y permisos, comprobar identidad, seleccionar encuadres móvil/desktop y optimizar WebP sin inventar escenas. `scripts/audit-photos.mjs --launch-gate` bloquea el lanzamiento mientras falte evidencia.

## Verificación local

- `npm test`: 9/9 pruebas pasan, incluidos sitemap/canonicals, ausencia de claims en fichas, redirecciones legacy y API de leads cerrada sin CRM real.
- `QA_BASE_URL=http://127.0.0.1:4174 npm run qa:mobile`: 320×844 y 390×844 pasan; sin overflow, errores de navegador, imágenes fallidas ni objetivos táctiles pequeños.
- `QA_BASE_URL=http://127.0.0.1:4174 npm run qa:desktop`: portada a 768×1024 y 1440×900, y cinco fichas a 390 y 1440; carga, navegación, wizard, imágenes y ancho pasan.
- Capturas: `docs/screenshots/home-320x844.png`, `home-390x844.png`, `home-768x1024.png` y `home-1440x900.png`.
- La QA usa servidor estático local para HTML/CSS/JS y pruebas unitarias para el middleware. No sustituye la comprobación de Cloudflare Pages, entrega real de leads ni validación del dominio final.

## Condiciones para aprobar publicación

1. Registrar permiso escrito y confirmación de identidad de cada foto publicada, incluida hero y vista social legal; sustituir la hero por una escena auténtica autorizada y ejecutar el gate fotográfico hasta PASS.
2. Definir dominio final y regenerar canonical, Open Graph y sitemap; comprobar HTTPS y redirecciones. Mantener pages.dev `noindex`.
3. Configurar el CRM con secretos fuera del repositorio, enviar un lead de prueba autorizado y confirmar un ID real. La API debe seguir fallando sin configuración.
4. Validar en Cloudflare las doce redirecciones temporales, las seis rutas del sitemap, las políticas de indexación y el comportamiento móvil/desktop antes de activar indexación en el dominio final.
5. Añadir contenido original y verificable a las fichas antes de competir por búsquedas de marca o activar las páginas de subcategorías.

## Avance SEO y tarifas de referencia — 2026-10-02

- La arquitectura por página, palabras objetivo y expansión condicionada se documenta en `docs/seo-architecture.md`. Se añadió una guía breve de comparación a la portada y contenido distintivo con enlaces internos a las cinco fichas. Se mantienen seis URL en sitemap y `noindex` en staging.
- Se comprobaron cinco EMD `.com` disponibles al momento de la consulta; la recomendación es `hosteriassantafedeantioquia.com`, sujeta a nueva comprobación antes de registrar. Ver `docs/domain-shortlist-2026-10-02.md`. No se compró dominio ni se alteraron canonical.
- Sin acceso a Demand API ni permiso escrito de Booking, las tarifas se observan manualmente como referencia interna mediante `scripts/booking-estimates.mjs`. Ninguna tarifa se publica sin confirmación escrita independiente del alojamiento o licencia específica, más evidencia y vigencia. El módulo opcional vuelve a comprobar vigencia mientras la ficha está abierta; `sync` retira rangos revocados del JSON antes del siguiente despliegue. No existe hoy JSON público de precios. Ver `docs/booking-estimates.md`.
- Verificación tras la integración: `npm test` 12/12; QA móvil 320/390 y desktop/tablet 768/1440 más cinco fichas a 390/1440 sin fallas; diff sin espacios sobrantes. La aprobación para indexación y lanzamiento sigue condicionada a los gates anteriores.
