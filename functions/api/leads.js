/**
 * POST /api/leads
 *
 * Flujo:
 * 1. Verificar origin, tamaño, Content-Type
 * 2. Detectar honeypot
 * 3. Verificar Turnstile (si TURNSTILE_SECRET_KEY está configurado)
 * 4. Validar y normalizar payload
 * 5. Crear lead en GestionaLeads
 * 6. Enviar notificación Telegram (no bloquea el éxito)
 * 7. Devolver { ok, leadId, notificationStatus }
 *
 * Producción nunca puede arrancar con GESTIONALEADS_MODE=mock.
 */

import { validateLead, normalizePhone } from '../lib/lead-validation.js';
import { checkOrigin, verifyTurnstile, checkHoneypot, checkRequestSize, generateRequestId } from '../lib/security.js';
import { createLead } from '../lib/gestionaleads.js';
import { sendTelegramLeadNotification } from '../lib/telegram.js';

export async function onRequestPost({ request, env }) {
  // Preflight CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(env) });
  }

  // Validaciones de transporte
  if (!checkRequestSize(request.headers.get('content-length'))) {
    return jsonError(413, 'Solicitud demasiado grande');
  }

  if (!checkOrigin(request)) {
    return jsonError(403, 'Origen no permitido');
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonError(415, 'Content-Type debe ser application/json');
  }

  // Leer body
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'JSON inválido');
  }

  // Honeypot
  if (checkHoneypot(body)) {
    // Respuesta falsa de éxito para no revelar la detección
    return jsonSuccess({ leadId: generateRequestId(), notificationStatus: 'sent' });
  }

  // Turnstile
  if (env?.TURNSTILE_SECRET_KEY) {
    const turnstileToken = body._turnstile;
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const result = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!result.success) {
      return jsonError(403, 'Verificación de seguridad fallida');
    }
  }

  // Validación de negocio
  const { ok: valid, errors } = validateLead(body);
  if (!valid) {
    return jsonError(422, errors[0] || 'Datos inválidos', { fields: errors });
  }

  // Normalizar teléfono
  const normalizedPhone = normalizePhone(body.contact?.phoneE164);
  if (!normalizedPhone) {
    return jsonError(422, 'Número de teléfono inválido');
  }

  // Guardar modo producción no puede ser mock
  const isProduction = env?.ENVIRONMENT === 'production';
  if (isProduction && env?.GESTIONALEADS_MODE === 'mock') {
    return jsonError(500, 'Configuración de producción incompleta');
  }

  const requestId = generateRequestId();
  const payload = {
    ...body,
    requestId,
    createdAt: new Date().toISOString(),
    environment: env?.ENVIRONMENT || 'preview',
    contact: { ...body.contact, phoneE164: normalizedPhone },
  };

  // Crear lead en GestionaLeads
  let leadId;
  try {
    const result = await createLead(payload, env);
    leadId = result.leadId;
  } catch (err) {
    console.error('[leads] error GestionaLeads:', err?.message);
    return jsonError(502, 'No pudimos registrar tu solicitud. Por favor, intenta de nuevo.');
  }

  // Notificar Telegram (sin bloquear éxito)
  const notifResult = await sendTelegramLeadNotification(
    { ...payload, leadId },
    env
  ).catch(err => {
    console.error('[leads] error Telegram:', err?.message);
    return { status: 'failed' };
  });

  return jsonSuccess({
    leadId,
    notificationStatus: notifResult.status,
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

function corsHeaders(env) {
  const origin = env?.SITE_URL || 'https://hosterias-santa-fe.pages.dev';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonSuccess(data) {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function jsonError(status, message, extra = {}) {
  return new Response(JSON.stringify({ ok: false, error: message, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
