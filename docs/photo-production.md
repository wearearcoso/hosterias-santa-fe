# Producción fotográfica para el lanzamiento

Fecha de auditoría: 2026-10-02. Alcance: portada, cinco fichas del sitemap y páginas legales. Los archivos locales sirven para maquetación; su presencia en el repositorio no acredita identidad del hotel ni permiso de publicación.

## Estado comprobado

- Hay 149 archivos de imagen (43 MB) en assets/images. El MVP usa siete: hero, cinco tarjetas/fichas y vista social de páginas legales. Los siete existen; los siete tienen derechos pendientes.
- El hero actual (hero-home.webp, 1920 × 1080) muestra una piscina con flotadores y sombrero vista desde arriba. No permite identificar Santa Fe de Antioquia ni una de las cinco propiedades. Se conserva solo para el staging.
- Las cinco fotos de tarjeta miden 800 px de ancho. Son aceptables para revisar la composición, pero insuficientes para una hero de escritorio o tarjetas grandes en pantallas de alta densidad. Se necesitan originales de mayor resolución.
- El script histórico process-images.sh recortaba y añadía ruido para aparentar originalidad. Está desactivado. Los scripts de scraping antiguos tampoco constituyen una vía para publicar fotos.
- Las tres referencias OG rotas a og-home.jpg de páginas legales apuntan ahora a og-home-social.webp; esa imagen sigue pendiente de licencia.

## Selección provisional de las cinco propiedades

| Propiedad | Archivo de maqueta | Lo que se observa | Uso recomendado después de verificar identidad y permiso | Encuadre |
| --- | --- | --- | --- | --- |
| Hostería Florida Tropical | florida-tropical-01.webp, 800 × 1183 | Piscina curvada vista desde arriba, palmeras y sombrillas | Tarjeta; pedir original horizontal para ficha | En móvil conservar la piscina; evitar cortar todos los bordes de la zona de baño |
| Hostería Los Fundadores | fundadores-01.webp, 800 × 860 | Acceso exterior con reja blanca y parasoles | Tarjeta de identidad; pedir foto de piscina o espacio principal para ficha | Centrar entrada; revisar sombras antes de publicar |
| Hotel Mariscal Robledo | mariscal-robledo-05.webp, 800 × 632 | Piscina rectangular entre palmeras | Tarjeta y ficha si el hotel confirma que es su instalación | Mantener piscina visible en recorte 3:2 |
| Hotel Portón del Sol | porton-del-sol-01.webp, 800 × 534 | Piscina amplia y kioscos de palma | Tarjeta; pedir original con colores menos saturados | Horizonte recto y piscina completa |
| Hotel Iguana | iguana-01.webp, 800 × 457 | Piscina exterior y kiosco de palma | Tarjeta; pedir original de al menos 1600 px para ficha | Preservar kiosco y piscina; no ampliar el archivo de 800 px |

Las descripciones son de lo visible, no una validación de que la escena pertenezca al establecimiento. El nombre de cada propiedad en la tabla refleja la asociación actual del proyecto, aún sin prueba fotográfica.

## Cómo obtener y preparar fotos reales

1. Solicitar al establecimiento o fotógrafo los archivos originales, preferiblemente JPEG/HEIC de al menos 2000 px de ancho para escenas horizontales, más una foto vertical de la misma propiedad para móvil. Pedir nombre de la propiedad, espacio fotografiado, fecha aproximada y autor.
2. Obtener permiso escrito que cubra el sitio, fichas, miniaturas y vistas sociales; registrar titular, tipo de autorización, fecha, caducidad y atribución exigida. Guardar el documento fuera de la carpeta pública del sitio y escribir su ruta o identificador en image-rights.json.
3. Confirmar con el establecimiento que cada escena corresponde a su propiedad y registrar esa evidencia por separado. Un enlace a su web o el nombre del archivo no bastan para confirmarlo.
4. Actualizar el registro de cada archivo en src/data/image-rights.json: status "authorized", rightsHolder, authorizationType, evidenceDocument, authorizedAt, identityVerified true e identityEvidenceDocument para fotos de propiedades. Sin esos datos la auditoría seguirá bloqueando el lanzamiento.
5. Preparar la foto con una copia local del original autorizado. Ejemplo:
   node scripts/prepare-authorized-photo.mjs --source /ruta/privada/original.jpg --file assets/images/iguana-01.webp --width 1280
   El comando respeta la relación de aspecto, aplica orientación y sRGB, elimina metadatos y exporta WebP. Rechaza originales menores que el ancho solicitado y registros sin autorización o identidad verificada. No inventa píxeles, no cambia instalaciones y no altera la escena.
6. Revisar manualmente color, nitidez, horizontes y recortes en móvil y desktop. Ajustar exposición y balance de blancos solo para representar la escena con fidelidad. Usar object-fit: cover y object-position por imagen para las tarjetas; no cortar piscinas, accesos o personas de forma engañosa. En el hero, mantener una zona de poco detalle detrás del titular.
7. Escribir alt que describa la escena visible en español. Una foto decorativa detrás de un titular puede llevar alt vacío; las fotos de tarjetas deben describir el contenido, no repetir "Foto 1", la palabra clave ni una atribución que no se haya verificado.
8. Ejecutar node scripts/audit-photos.mjs --launch-gate. Solo con salida PASS podrán retirarse los avisos de staging y noindex por razones fotográficas.

## Especificaciones de entrega

- Hero escritorio: original autorizado de al menos 1920 px de ancho, encuadre horizontal; buscar 200–350 KB WebP sin artefactos perceptibles. Hero móvil: toma vertical real del mismo establecimiento o escena, no ampliación de un recorte pequeño.
- Tarjetas: original de al menos 1280 px de ancho para render aproximado de 640 px a 2×; salida WebP objetivo 80–140 KB, según detalle.
- Fichas: escena principal auténtica y 3–5 fotos complementarias solo si cada una tiene identidad y derechos comprobados. No repetir una única foto para simular una galería.
- OG: 1200 × 630, derivada de una foto autorizada con encuadre revisado. No publicar imágenes OG que apunten a archivos inexistentes.
- Conservar originales y licencias fuera del despliegue público; documentar en el registro qué versión optimizada deriva de cada original.

## Decisión de lanzamiento fotográfico

Bloqueado. La composición del staging puede revisarse en móvil y desktop, pero no se debe considerar aprobada para publicación hasta verificar identidad y permiso de las siete imágenes activas o reemplazarlas por alternativas autorizadas. Una foto más representativa para la hero debe proceder de una de las cinco propiedades del MVP y cumplir el mismo registro.
