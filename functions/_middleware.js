/**
 * Cloudflare Pages middleware — control de indexación variable-driven.
 *
 * Variables de entorno:
 *   SEO_INDEXING_ENABLED=false  → noindex siempre (staging por defecto)
 *   SEO_INDEXING_ENABLED=true   → permite indexación si el dominio NO es .pages.dev
 *
 * Rutas técnicas siempre reciben noindex independientemente de la variable.
 */

const ALWAYS_NOINDEX_PATHS = [
  '/habeas-data',
  '/terminos',
  '/politica-privacidad',
  '/servicios',
  '/tour-detalle',
];

const LEGACY_CONTENT_PATHS = new Set([
  '/dia-de-sol-santa-fe-de-antioquia',
  '/guia-santa-fe-de-antioquia',
  '/hosterias-para-parejas-santa-fe-de-antioquia',
  '/hoteles-boutique-santa-fe-de-antioquia',
  '/hoteles-cerca-parque-santa-fe-de-antioquia',
  '/hoteles-coloniales-santa-fe-de-antioquia',
  '/hoteles-con-piscina-santa-fe-de-antioquia',
  '/hoteles-economicos-santa-fe-de-antioquia',
  '/hoteles-para-eventos-santa-fe-de-antioquia',
  '/hoteles-para-familias-santa-fe-de-antioquia',
  '/hoteles-santa-fe-de-antioquia',
  '/hoteles-todo-incluido-santa-fe-de-antioquia',
]);

const ROBOTS_BLOCK = 'noindex, nofollow, noarchive';
const ROBOTS_ALLOW = 'index, follow';

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const route = url.pathname.replace(/\/$/, '').replace(/\.html$/, '');
  if (LEGACY_CONTENT_PATHS.has(route)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL('/', url).href,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': ROBOTS_BLOCK,
      },
    });
  }

  const response = await next();

  const isPagesDev = url.hostname.includes('.pages.dev');
  const indexingEnabled = env?.SEO_INDEXING_ENABLED === 'true';

  // Rutas técnicas siempre noindex
  const isAlwaysNoindex = ALWAYS_NOINDEX_PATHS.some(p => url.pathname === p || url.pathname.startsWith(p + '/'));

  // Bloquear si: es pages.dev, indexación deshabilitada, o es ruta técnica
  const shouldBlock = isPagesDev || !indexingEnabled || isAlwaysNoindex;

  const newHeaders = new Headers(response.headers);
  if (shouldBlock) {
    newHeaders.set('X-Robots-Tag', ROBOTS_BLOCK);
  } else {
    // Solo quitar el bloqueo en producción con indexación habilitada
    newHeaders.delete('X-Robots-Tag');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
