(() => {
  const wizard = document.getElementById('leadWizard');
  const form = document.getElementById('leadForm');
  const property = document.getElementById('property');
  const status = document.getElementById('formStatus');
  let opener = null;
  const open = button => {
    opener = button;
    property.value = button.dataset.property || '';
    wizard.hidden = false;
    document.body.style.overflow = 'hidden';
    wizard.querySelector('input:not(.hp)').focus();
  };
  const close = () => {
    wizard.hidden = true;
    document.body.style.overflow = '';
    opener?.focus();
  };
  document.querySelectorAll('[data-lw-open]').forEach(button => button.addEventListener('click', () => open(button)));
  wizard.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !wizard.hidden) close(); });
  if (location.hash === '#solicitud') open(document.querySelector('[data-lw-open]'));
  form.addEventListener('submit', async event => {
    event.preventDefault(); status.textContent = '';
    const data = new FormData(form);
    const digits = String(data.get('phone') || '').replace(/\D/g, '');
    const phone = digits.length === 10 ? `+57${digits}` : `+${digits}`;
    const payload = { schemaVersion:'1.0', sourceSite:location.origin, pageUrl:location.href, landingPage:location.pathname, request:{ planType:'alojamiento', checkIn:data.get('checkIn') || undefined, adults:Number(data.get('adults')), children:0, preferences:[], selectedPropertyName:data.get('property') || undefined }, contact:{ fullName:data.get('fullName'), phoneE164:phone }, consent:{ accepted:data.get('consent') === 'on', version:'staging-1', timestamp:new Date().toISOString() }, _hp:data.get('_hp') || '' };
    const submit = form.querySelector('[type=submit]'); submit.disabled = true; submit.textContent = 'Enviando…';
    try {
      const response = await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok || !result.leadId) throw new Error(result.error || 'No pudimos registrar la solicitud. Intenta de nuevo.');
      form.innerHTML = `<div class="success"><span class="material-symbols-rounded">check_circle</span><h3>Solicitud registrada</h3><p>Referencia: <strong>${String(result.leadId).replace(/[<>&]/g,'')}</strong></p><p>Un asesor revisará disponibilidad y condiciones.</p></div>`;
    } catch (error) { status.textContent = error.message; submit.disabled = false; submit.textContent = 'Enviar solicitud'; }
  });
})();
