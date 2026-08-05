/* ================================================
   Hosterías Santa Fe de Antioquia — main.js
   ================================================ */

/* ---- Scroll direction detect → header classes ---- */
(function () {
  const header = document.querySelector('.field-header');
  if (!header) return;
  let lastY = 0, ticking = false;

  function update() {
    const y = window.scrollY;
    if (y <= 24) {
      header.classList.remove('scrolling', 'scrolling-down');
    } else {
      header.classList.add('scrolling');
      if (y > lastY + 4)       header.classList.add('scrolling-down');
      else if (y < lastY - 4)  header.classList.remove('scrolling-down');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ---- Hamburger + Mobile Menu ---- */
(function () {
  const btn    = document.querySelector('.hamburger-btn');
  const menu   = document.querySelector('.mobile-menu');
  const header = document.querySelector('.field-header');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('active');
    menu.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.classList.contains('active')) {
      btn.classList.remove('active');
      menu.classList.remove('open');
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  });
})();

/* ---- Nav accordion (mobile submenu) ---- */
(function () {
  document.querySelectorAll('.nav-link[data-submenu]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sub = document.getElementById(link.dataset.submenu);
      if (!sub) return;
      const isOpen = sub.classList.contains('open');
      // Close all
      document.querySelectorAll('.nav-submenu.open').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
      if (!isOpen) { sub.classList.add('open'); link.classList.add('active'); }
    });
  });
})();

/* ---- Intersection Observer: fade-in + SVG draw ---- */
(function () {
  const animEls  = document.querySelectorAll('[data-animate]');
  const drawEls  = document.querySelectorAll('.svg-draw');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  const drawIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('drawn');
      drawIO.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => io.observe(el));
  drawEls.forEach(el => drawIO.observe(el));
})();

/* ---- Accordion ---- */
(function () {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      const group  = item.closest('[data-acc-group]');
      if (group) group.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ---- Office selector (contact page) ---- */
(function () {
  const btns = document.querySelectorAll('.office-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.office;
      document.querySelectorAll('[data-office]').forEach(el => {
        el.classList.toggle('active', el.dataset.office === id);
      });
    });
  });
  // Activate first by default
  if (btns[0]) btns[0].click();
})();

/* ---- WhatsApp Availability Modal (4 steps) ---- */
(function () {
  const modal = document.getElementById('dispoModal');
  if (!modal) return;

  const SUPABASE_URL = 'https://zyewvrlhfgzddmipcgqh.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZXd2cmxoZmd6ZGRtaXBjZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MDE2OTAsImV4cCI6MjA0MzI3NzY5MH0.tUcVQBPLsJdMV6AVBjm4XQTGYoOMtJqGJ6OjDHnNXG8';
  const WA_DESTINO = '573170000000';

  const state = {
    establecimiento: '',
    plan: '',
    personas: '',
    fecha: '',
    presupuesto: '',
    nombre: '',
    tel: '',
    email: '',
    notas: ''
  };

  function trackEvent(name, data) {
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, ...data });
    }
  }

  function waOpen(estName) {
    state.establecimiento = estName || '';
    state.step = 1;
    document.querySelectorAll('.wa-choice.selected').forEach(b => b.classList.remove('selected'));
    ['waNombre','waTelefono','waEmail','waNotas','waHabeas','wa_honeypot'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { if (id === 'waHabeas') el.checked = true; else el.value = ''; }
    });
    document.getElementById('waFecha').value = '';
    document.getElementById('waPresupuesto').value = '';
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
    waSetStep(1);
    trackEvent('modal_disponibilidad_abierto', { establecimiento: state.establecimiento });
  }

  function waClose() {
    modal.classList.remove('open');
    setTimeout(() => { modal.setAttribute('hidden',''); document.body.style.overflow = ''; }, 350);
  }

  function waSetStep(n) {
    document.querySelectorAll('.wa-step').forEach(s => s.classList.remove('active'));
    const stepEl = document.querySelector(`.wa-step[data-wstep="${n}"]`);
    if (stepEl) stepEl.classList.add('active');

    document.querySelectorAll('.wa-dot').forEach(d => {
      d.classList.remove('active','done');
      if (+d.dataset.dot === n) d.classList.add('active');
      else if (+d.dataset.dot < n) d.classList.add('done');
    });

    document.getElementById('waBtnBack').style.display = n > 1 ? '' : 'none';
    document.getElementById('waBtnNext').style.display = n < 4 ? '' : 'none';
    document.getElementById('waBtnSubmit').style.display = n === 4 ? '' : 'none';

    if (n === 4) waRenderSummary();
  }

  function waRenderSummary() {
    document.getElementById('waSumEstablecimiento').textContent = state.establecimiento || 'No especificado';
    document.getElementById('waSumPlan').textContent = state.plan;
    document.getElementById('waSumPersonas').textContent = state.personas;
    document.getElementById('waSumFecha').textContent = document.getElementById('waFecha').value || 'No especificada';
    document.getElementById('waSumPresupuesto').textContent = document.getElementById('waPresupuesto').value || 'No especificado';
    document.getElementById('waSumNombre').textContent = state.nombre;
    document.getElementById('waSumTel').textContent = state.tel;
  }

  function waValidate() {
    if (!state.plan) { alert('Por favor selecciona el tipo de plan'); return false; }
    if (!state.personas) { alert('Por favor indica cuántas personas'); return false; }
    state.nombre = document.getElementById('waNombre').value.trim();
    state.tel = document.getElementById('waTelefono').value.trim().replace(/\D/g,'');
    if (!state.nombre) { alert('Ingresa tu nombre completo'); return false; }
    if (state.tel.length < 7) { alert('Ingresa un número de WhatsApp válido'); return false; }
    return true;
  }

  async function waSubmit() {
    if (!waValidate()) return;
    const honeypot = document.getElementById('wa_homeypot')?.value;
    if (honeypot) { waClose(); return; }
    const habeasOk = document.getElementById('waHabeas').checked;
    if (!habeasOk) { alert('Debes aceptar la política de tratamiento de datos'); return; }

    const btn = document.getElementById('waBtnSubmit');
    btn.disabled = true;
    document.getElementById('waRedirectMsg').style.display = 'block';

    const payload = {
      session_id: sessionStorage.getItem('hsfa_session') || crypto.randomUUID(),
      establecimiento: state.establecimiento,
      tipo_plan: state.plan,
      personas: state.personas,
      fecha_estimada: document.getElementById('waFecha').value,
      presupuesto: document.getElementById('waPresupuesto').value,
      nombre: state.nombre,
      whatsapp_tel: state.tel,
      correo: document.getElementById('waEmail').value,
      preferencias: document.getElementById('waNotas').value,
      habeas_data: true,
      habeas_data_timestamp: new Date().toISOString(),
      completado: true
    };

    // Save to Supabase
    try {
      const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/leads_hospedaje`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!sbRes.ok) console.warn('Supabase save warning:', sbRes.status);
    } catch (e) {
      console.warn('Supabase error:', e);
    }

    // Build WhatsApp message
    const msg = [
      `¡Hola! Vi ${state.establecimiento ? state.establecimiento + ' en' : ''} hosteriassantafe.com y quiero verificar disponibilidad.`,
      ``,
      `🏨 Establecimiento: ${state.establecimiento || 'Por definir'}`,
      `📋 Plan: ${state.plan}`,
      `👥 Personas: ${state.personas}`,
      `📅 Cuándo: ${document.getElementById('waFecha').value || 'Por definir'}`,
      `💰 Presupuesto: ${document.getElementById('waPresupuesto').value || 'No especificado'}`,
      `👤 Nombre: ${state.nombre}`,
      `📱 Mi WhatsApp: ${state.tel}`,
      state.email ? `📧 Email: ${state.email}` : '',
      document.getElementById('waNotas').value ? `📝 Notas: ${document.getElementById('waNotas').value}` : '',
      ``,
      `¿Tienen disponibilidad?`
    ].filter(Boolean).join('\n');

    trackEvent('whatsapp_disponibilidad_enviado', { establecimiento: state.establecimiento, tipo_plan: state.plan });

    sessionStorage.setItem('hsfa_session', payload.session_id);

    setTimeout(() => {
      window.open(`https://wa.me/${WA_DESTINO}?text=${encodeURIComponent(msg)}`, '_blank');
      waClose();
    }, 1500);
  }

  // Event bindings
  document.querySelectorAll('[data-wa-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const est = btn.dataset.waEstablecimiento || state.establecimiento || '';
      waOpen(est);
    });
  });

  document.querySelectorAll('[data-wa-close]').forEach(el => {
    el.addEventListener('click', waClose);
  });

  document.getElementById('waBtnNext').addEventListener('click', () => {
    let next = 1;
    if (state.plan) next = 2;
    if (state.personas) next = 3;
    if (state.nombre) next = 4;
    next = Math.min(next + 1, 4);
    waSetStep(next);
  });

  document.getElementById('waBtnBack').addEventListener('click', () => {
    let prev = 4;
    if (state.plan) prev = 2;
    if (state.personas) prev = 3;
    prev = Math.max(prev - 1, 1);
    waSetStep(prev);
  });

  document.getElementById('waBtnSubmit').addEventListener('click', waSubmit);

  // Choice buttons
  document.querySelectorAll('.wa-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      parent.querySelectorAll('.wa-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.dataset.val;

      // Determine which step we're on
      const activeStep = document.querySelector('.wa-step.active');
      if (!activeStep) return;
      const stepNum = +activeStep.dataset.wstep;

      if (stepNum === 1) { state.plan = val; waSetStep(2); }
      else if (stepNum === 2) { state.personas = val; waSetStep(3); }
    });
  });

  // Auto-advance on step 3: move to step 4 when name and phone are filled
  const waNombreEl = document.getElementById('waNombre');
  const waTelEl = document.getElementById('waTelefono');
  if (waNombreEl && waTelEl) {
    const checkStep3 = () => {
      if (state.personas && waNombreEl.value.trim() && waTelEl.value.trim().length >= 7) {
        state.nombre = waNombreEl.value.trim();
        state.tel = waTelEl.value.trim();
        waSetStep(4);
      }
    };
    waNombreEl.addEventListener('input', checkStep3);
    waTelEl.addEventListener('input', checkStep3);
  }

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) waClose();
  });

  // Float button on detail pages triggers with establishment name
  const floatWA = document.querySelector('.float-wa');
  if (floatWA) {
    floatWA.addEventListener('click', function(e) {
      const estName = this.dataset.waEstablecimiento || document.querySelector('h1')?.textContent?.trim() || '';
      if (estName) {
        e.preventDefault();
        waOpen(estName);
      }
    });
  }
})();

/* ---- Swiper initialization ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  /* Tours / Habitaciones carousel */
  const toursEl = document.querySelector('.swiper-tours');
  if (toursEl) {
    new Swiper(toursEl, {
      slidesPerView: 1.18,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      loopAdditionalSlides: 2,
      breakpoints: {
        640:  { slidesPerView: 1.55, spaceBetween: 20, loop: true },
        1024: { slidesPerView: 3.1,  spaceBetween: 24, centeredSlides: true, loop: false },
      },
    });
  }

  /* Footer testimonials */
  const testEl = document.querySelector('.swiper-testimonials');
  if (testEl) {
    new Swiper(testEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5500, disableOnInteraction: false },
      navigation: { nextEl: '.footer-next', prevEl: '.footer-prev' },
    });
  }
});
