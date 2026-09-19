/**
 * Adaptador de GestionaLeads.
 * GESTIONALEADS_MODE=real llama a la API real (requiere API_URL + API_TOKEN).
 * El adaptador falla cerrado: mock y valores ausentes nunca generan éxitos ficticios.
 */


async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function createLead(payload, env) {
  const mode = env?.GESTIONALEADS_MODE;
  if (!mode) throw new Error('GestionaLeads: mode real requerido');
  if (mode === 'mock') throw new Error('GestionaLeads: mock deshabilitado');
  if (mode !== 'real') throw new Error('GestionaLeads: mode inválido; use real');

  // Modo real
  const apiUrl = env?.GESTIONALEADS_API_URL;
  const token = env?.GESTIONALEADS_API_TOKEN;

  if (!apiUrl || !token) {
    throw new Error('GestionaLeads: credenciales no configuradas');
  }

  // Webhook schema expected by GestionaLeads /lead/web.
  const messageParts = [
    payload.request.notes,
    payload.request.preferences?.length
      ? `Preferencias: ${payload.request.preferences.join(', ')}`
      : null,
    payload.request.occasion ? `Ocasión: ${payload.request.occasion}` : null,
    payload.request.checkIn
      ? `Fechas: ${payload.request.checkIn}${payload.request.checkOut ? ' → ' + payload.request.checkOut : ''}`
      : payload.request.flexibleDates ? 'Fechas: flexibles' : null,
    payload.request.adults
      ? `Viajeros: ${payload.request.adults} adulto(s)${payload.request.children ? `, ${payload.request.children} niño(s)` : ''}`
      : null,
    payload.request.budgetRange ? `Presupuesto: ${payload.request.budgetRange}` : null,
    payload.request.selectedPropertyName
      ? `Propiedad consultada: ${payload.request.selectedPropertyName}`
      : null,
  ].filter(Boolean);

  const glPayload = {
    nombre: payload.contact.fullName,
    telefono: payload.contact.phoneE164,
    email: payload.contact.email || '',
    servicio: payload.request.planType || 'Hospedaje',
    ubicacion: 'Santa Fe de Antioquia',
    mensaje: messageParts.join('\n'),
    fuente: payload.attribution?.utmSource || 'hosterias-santa-fe-web',
    pagina: payload.landingPage || 'https://hosterias-santa-fe.pages.dev',
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Idempotency-Key': payload.requestId,
        },
        body: JSON.stringify(glPayload),
      });

      if (res.ok) {
        const data = await res.json();
        const leadId = data.id || data.leadId || data.lead_id;
        if (!leadId) throw new Error('GestionaLeads: respuesta sin leadId');
        return { ok: true, leadId, mode: 'real' };
      }

      // 4xx → no reintentar (error del cliente)
      if (res.status >= 400 && res.status < 500) {
        const text = await res.text().catch(() => '');
        throw new Error(`GestionaLeads ${res.status}: ${text.substring(0, 200)}`);
      }

      lastError = new Error(`GestionaLeads ${res.status}`);
    } catch (err) {
      if (err.message.startsWith('GestionaLeads 4')) throw err; // 4xx no se reintenta
      lastError = err;
    }

    if (attempt < 3) await sleep(300 * attempt);
  }

  throw lastError;
}

export async function updateLeadContactPreference(leadId, preference, env) {
  const mode = env?.GESTIONALEADS_MODE;
  if (mode !== 'real') return { ok: false, error: 'modo real requerido' };

  const apiUrl = env?.GESTIONALEADS_API_URL;
  const token = env?.GESTIONALEADS_API_TOKEN;
  if (!apiUrl || !token) return { ok: false, error: 'credenciales no configuradas' };

  try {
    const res = await fetch(`${apiUrl}/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ contact_preference: preference }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
