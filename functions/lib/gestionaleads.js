/**
 * Adaptador de GestionaLeads.
 * GESTIONALEADS_MODE=mock  → devuelve leadId ficticio para preview/pruebas
 * GESTIONALEADS_MODE=real  → llama a la API real (requiere API_URL + API_TOKEN)
 *
 * Producción NUNCA puede arrancar en modo mock (verificado en leads.js).
 */

function mockLeadId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'GL-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function createLead(payload, env) {
  const mode = env?.GESTIONALEADS_MODE || 'mock';

  if (mode === 'mock') {
    await sleep(200 + Math.random() * 100); // simula latencia de red
    return { ok: true, leadId: mockLeadId(), mode: 'mock' };
  }

  // Modo real
  const apiUrl = env?.GESTIONALEADS_API_URL;
  const token = env?.GESTIONALEADS_API_TOKEN;
  const workspaceId = env?.GESTIONALEADS_WORKSPACE_ID;
  const pipelineId = env?.GESTIONALEADS_PIPELINE_ID;

  if (!apiUrl || !token) {
    throw new Error('GestionaLeads: credenciales no configuradas');
  }

  // Mapeo del payload al esquema de GestionaLeads
  // PENDIENTE: ajustar campos cuando se reciba documentación oficial de la API
  const glPayload = {
    workspace_id: workspaceId,
    pipeline_id: pipelineId,
    idempotency_key: payload.requestId,
    contact: {
      name: payload.contact.fullName,
      phone: payload.contact.phoneE164,
      email: payload.contact.email,
    },
    fields: {
      plan_type: payload.request.planType,
      check_in: payload.request.checkIn,
      check_out: payload.request.checkOut,
      adults: payload.request.adults,
      children: payload.request.children,
      budget_range: payload.request.budgetRange,
      occasion: payload.request.occasion,
      preferences: (payload.request.preferences || []).join(', '),
      property_name: payload.request.selectedPropertyName,
      notes: payload.request.notes,
      source_page: payload.landingPage,
      utm_source: payload.attribution?.utmSource,
    },
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(apiUrl + '/leads', {
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
        return { ok: true, leadId: data.id || data.leadId || data.lead_id, mode: 'real' };
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
  const mode = env?.GESTIONALEADS_MODE || 'mock';
  if (mode === 'mock') return { ok: true };

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
