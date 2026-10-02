# Precios de referencia por alojamiento: proceso interno

Estado al 2 de octubre de 2026: **no hay rangos aprobados para mostrar**. Sergio confirmó que no tiene acceso a Demand API ni permiso escrito de Booking.com para automatizar el acceso. El archivo privado creado por `scripts/booking-estimates.mjs` contiene las cinco fichas, pero cero observaciones y todas las publicaciones siguen bloqueadas.

## Por qué este proceso es manual

Los [términos de Booking.com, sección A15.2](https://www.booking.com/content/terms.html) prohíben el acceso, monitoreo, copia o extracción mediante robots, scrapers, navegadores automatizados o asistentes sin autorización previa y expresa. Su [robots.txt](https://www.booking.com/robots.txt) publica reglas de rastreo; que una ruta de hotel no figure como bloqueada para el agente genérico **no concede permiso** frente a los términos. El script antiguo `scripts/scrape-booking.js` extraía fotos mediante Playwright: no debe ejecutarse para este trabajo ni reutilizarse para precios.

La [Demand API oficial](https://developers.booking.com/demand/docs/getting-started/prerequisites) requiere registro como Managed Affiliate Partner, contrato, acceso al Partner Centre, token y `X-Affiliate-Id`. Si se obtiene acceso más adelante, primero habrá que revisar que el contrato permita este uso en un portal de captación de leads. La [guía de precios](https://developers.booking.com/demand/docs/accommodations/prices-accommodations) distingue precio base, precio mostrable y total; las [reglas de visualización](https://developers.booking.com/demand/docs/accommodations/display-prices) exigen indicar cargos y condiciones. La API y el sitio público [pueden tener inventario y precios distintos](https://developers.booking.com/demand/docs/accommodations/search-for-available-properties).

**Booking sirve ahora como benchmark interno.** Una captura manual no equivale a autorización para republicar sus datos. El rango público requiere una confirmación independiente y escrita del alojamiento sobre sus propias tarifas y condiciones, o una licencia escrita de Booking que cubra expresamente la publicación prevista. Hasta entonces, las fichas deben decir «Consultar tarifa vigente».

## Las cinco correspondencias por confirmar

Estos son **enlaces candidatos**, hallados por nombre y ubicación; el operador debe comprobar identidad y dirección antes de marcar `bookingMatchVerified: true`. No usar otros establecimientos parecidos, ni dar por confirmada la marca «Hotel Iguana» frente al nombre comercial actual de Booking.

| ID del catálogo | Posible ficha Booking | Estado |
|---|---|---|
| `florida-tropical` | [Hostería Florida Tropical](https://www.booking.com/hotel/co/hosteria-florida-tropical-santa-fe-de-antioquia.es.html) | Candidata |
| `fundadores` | [Hostería Fundadores](https://www.booking.com/hotel/co/hosteria-fundadores.es.html) | Candidata; cotejar con «Los Fundadores» |
| `mariscal-robledo` | [Hotel Mariscal Robledo](https://www.booking.com/hotel/co/mariscal-robledo.es.html) | Candidata |
| `porton-del-sol` | [Hotel Portón del Sol](https://www.booking.com/hotel/co/porton-del-sol.es.html) | Candidata |
| `iguana` | [La Iguana de Santa Fe by Bernalo Hotels](https://www.booking.com/hotel/co/ab-del-sol-campestre-santa-fe-de-antioquia.es.html) | Candidata; confirmar cambio de nombre |

## Procedimiento de captura

1. Ejecutar `node scripts/booking-estimates.mjs init` una vez. Crea `.local/booking-prices/observations.json` con permisos de solo usuario. La carpeta completa está en `.gitignore` y debe permanecer fuera de Git.
2. Un humano abre cada ficha candidata, coteja nombre, dirección y sitio oficial del hotel, y guarda la evidencia en `.local/booking-prices/evidence/`. Registrar la ruta relativa en `matchEvidence`; marcar `bookingMatchVerified: true` solo tras el cotejo. No usar scripts, extensiones de extracción, ni asistentes que naveguen Booking automáticamente.
3. Para **cada alojamiento**, consultar al menos cuatro noches futuras distintas: dos **fechas de llegada diferentes** de lunes–jueves y dos **fechas de llegada diferentes** de viernes–sábado. Repetir una cotización para la misma noche no suma una nueva muestra. Usar siempre **una habitación, dos adultos, cero niños, una noche, COP y tarifa pública sin sesión/Genius**. Registrar el mismo `roomType` y `mealPlan` en las cuatro observaciones. Si la habitación o plan cambia, crear otra serie comparable en vez de mezclarla.
4. En `observations`, añadir por consulta: `source: "booking-manual"`, `observedAt` (`AAAA-MM-DD`), `checkIn`, `checkOut`, `adults: 2`, `children: 0`, `rooms: 1`, `currency: "COP"`, `displayTotal` (número COP por estancia de una noche), `mandatoryChargesIncluded: true`, `rateEligibility: "public"`, `roomType`, `mealPlan` y `evidence` (archivo dentro de `.local/booking-prices/`). Si hay cargos obligatorios que no se pueden determinar, dejar `mandatoryChargesIncluded: false`: esa observación no será válida. Documentar en la evidencia las condiciones de cancelación y qué impuestos/cargos aparecen.
5. Ejecutar `node scripts/booking-estimates.mjs report`. El script **no accede a internet**. Solo calcula mínimo y máximo cuando las cuatro observaciones son recientes (siete días), futuras y comparables. La salida es interna y no constituye un precio de venta ni disponibilidad garantizada.
6. Solicitar al alojamiento confirmación escrita de su propio rango para esas fechas, ocupación, impuestos y condiciones. Guardar la evidencia local. Registrar en `publication`: `status: "approved"`, `basis: "hotel-written-approval"`, `approvalEvidence`, `reviewer`, `reviewedAt`, `expiresAt`, `approvedMin` y `approvedMax`. Si Booking otorga licencia escrita específica, se puede usar `basis: "booking-written-license"` tras revisión del contrato. La vigencia máxima del gate es siete días.
7. Ejecutar `node scripts/booking-estimates.mjs public --property=ID --output=src/data/verified-rate-ranges.json` **solo cuando se vaya a integrar una ficha aprobada**. La propiedad indicada debe pasar todos los controles; al escribir, el script reconstruye `prices[]` con **todas** las propiedades que todavía pasen sus controles con el archivo privado actual, y omite las vencidas o incompletas. Así no se pierden aprobaciones vigentes al actualizar otra ficha. Si la propiedad indicada falla, no escribe JSON; para aplicar una revocación hay que ejecutar `sync`. Sin `--property`, `public` genera todas las aprobadas y falla si no queda ninguna. El archivo `src/data/verified-rate-ranges.json` permanece ausente por defecto. El JSON contiene `generatedAt` y `prices[]`; cada entrada aprobada incluye `propertyId`, `propertyName`, `slug`, `range` (`min`, `max`, `currency`, `sampleCount`, `checkIns`, `observedAt`, `roomType`, `mealPlan`, `adults`, `rooms`, `nights`, `mandatoryChargesIncluded`), `expiresAt`, `verificationBasis` y `disclaimer`. Después de crear el JSON, ejecutar `node scripts/generate-approved-details.mjs` para insertar el módulo en las cinco fichas. El módulo permanece oculto hasta que `assets/js/verified-rates.js` vuelva a validar en el navegador identidad, condiciones, antigüedad y `expiresAt`; `_headers` evita almacenar el JSON en caché. Si el archivo no existe al generar, el HTML no incluye el módulo. No se publica ningún rango al completar este documento.

### Formato de una observación

```json
{
  "source": "booking-manual",
  "observedAt": "AAAA-MM-DD",
  "checkIn": "AAAA-MM-DD",
  "checkOut": "AAAA-MM-DD",
  "adults": 2,
  "children": 0,
  "rooms": 1,
  "currency": "COP",
  "displayTotal": 0,
  "mandatoryChargesIncluded": false,
  "rateEligibility": "public",
  "roomType": "habitación doble identificada",
  "mealPlan": "desayuno incluido o no incluido",
  "evidence": ".local/booking-prices/evidence/archivo-local.png"
}
```

`displayTotal: 0` y `mandatoryChargesIncluded: false` son **marcadores inválidos**; se sustituyen únicamente tras una consulta real. El operador debe preservar la captura completa con fecha, estancia, ocupación, moneda, habitación, plan y cargos. Evitar datos personales de la sesión en esas capturas.

## Cómo se mostraría en la ficha tras la aprobación

> Rango orientativo: **COP $X–$Y por una noche**, una habitación para dos adultos. Muestra consultada el **[fecha]** para estancias **[fechas]**. **[Impuestos y cargos obligatorios incluidos / desglose aplicable].** Sujeto a disponibilidad y condiciones; confirma la tarifa vigente antes de reservar.

El módulo implementado muestra el rango solo en la ficha correspondiente, junto a un CTA de consulta, tras la validación en tiempo de ejecución. No añadir `Offer`, `AggregateOffer`, `priceRange` ni promesas de «mejor precio» a los datos estructurados mientras no exista tarifa vigente verificable para una fecha concreta. El rango combina fechas de muestra; no implica que cualquier fecha o habitación esté disponible a esos valores. Si la autorización vence o falta evidencia, ocultar cifras y volver a «Consultar tarifa vigente».

## Control de publicación

La herramienta bloquea una propiedad si faltan: correspondencia documentada de la ficha, cuatro noches comparables, precios COP con cargos obligatorios claros, capturas locales, revisión en siete días, y aprobación escrita del hotel o licencia escrita específica de Booking con mínimo y máximo exactos. La aprobación humana sigue siendo necesaria para confirmar que el documento realmente concede ese uso; el script solo valida campos y existencia de archivos. Se recomienda revisar semanalmente y renovar la aprobación antes de cada actualización pública.

**Sincronización y revocación:** después de cambiar cualquier `publication.status` a `revoked`/`pending`, eliminar evidencia, o al vencer una aprobación, ejecutar `node scripts/booking-estimates.mjs sync`. El comando ignora fichas que ya no pasan el gate y reescribe `src/data/verified-rate-ranges.json` solo con las aprobaciones vigentes del archivo privado; si no queda ninguna, retira el JSON. `sync` no admite `--property`; la salida solo puede ser el JSON público previsto o un archivo de prueba dentro de `.local/booking-prices/`. Luego ejecutar `node scripts/generate-approved-details.mjs`, revisar las fichas y desplegar el cambio; verificar en la URL publicada que las cifras revocadas desaparecieron. Una revocación local no llega al sitio publicado hasta el despliegue. La comprobación de caducidad en el navegador evita mostrar una aprobación vencida mientras se actualiza el despliegue.
