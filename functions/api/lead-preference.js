/**
 * POST /api/leads/contact-preference
 *
 * Registra la preferencia de contacto del usuario después del éxito:
 * { leadId, preference: "whatsapp" | "wait_for_agent" }
 *
 * Solo actualiza GestionaLeads si la API lo permite.
 * No falla visiblemente — el lead ya fue guardado.
 */

import { updateLeadContactPreference } from '../lib/gestionaleads.js';
import { checkOrigin, checkRequestSize } from '../lib/security.js';

export async function onRequestPost({ request, env }) {
  if (!checkRequestSize(request.headers.get('content-length'), 1024)) {
    return jsonError(413, 'Solicitud demasiado grande');
  }

  if (!checkOrigin(request)) {
    return jsonError(403, 'Origen no permitido');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'JSON inválido');
  }

  const { leadId, preference } = body || {};

  if (!leadId || typeof leadId !== 'string') {
    return jsonError(422, 'leadId requerido');
  }

  const allowed = ['whatsapp', 'wait_for_agent'];
  if (!allowed.includes(preference)) {
    return jsonError(422, `preference debe ser: ${allowed.join(' | ')}`);
  }

  const result = await updateLeadContactPreference(leadId, preference, env).catch(() => ({ ok: false }));

  return new Response(JSON.stringify({ ok: result.ok, leadId, preference }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
