/**
 * Utilidades de seguridad para Pages Functions.
 * Honeypot, Turnstile, validación de origen, tamaño de request.
 */

const ALLOWED_ORIGINS = [
  'https://hosterias-santa-fe.pages.dev',
  'http://localhost:8788',
  'http://localhost:3000',
];

export function checkOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.some(o => origin.startsWith(o));
}

export async function verifyTurnstile(token, secretKey, ip) {
  if (!secretKey || !token) return { success: !secretKey }; // sin key → skip
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip || '' }),
    });
    const data = await res.json();
    return { success: data.success === true };
  } catch {
    return { success: false };
  }
}

export function checkHoneypot(body) {
  return !!(body?._hp);
}

export function checkRequestSize(contentLength, maxBytes = 16384) {
  const len = parseInt(contentLength || '0', 10);
  return len <= maxBytes;
}

export function generateRequestId() {
  return crypto.randomUUID();
}
