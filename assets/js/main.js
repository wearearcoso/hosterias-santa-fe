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

/* ---- WhatsApp Availability Modal (5 steps + confetti) ---- */
(function () {
  const modal = document.getElementById('dispoModal');
  if (!modal) return;

  const SUPABASE_URL = 'https://zyewvrlhfgzddmipcgqh.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZXd2cmxoZmd6ZGRtaXBjZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MDE2OTAsImV4cCI6MjA0MzI3NzY5MH0.tUcVQBPLsJdMV6AVBjm4XQTGYoOMtJqGJ6OjDHnNXG8';
  const WA_DESTINO = '573170000000';

  const state = {
    establecimiento: '', plan: '', adultos: 2, ninos: 0,
    fechaLlegada: '', fechaSalida: '',
    nombre: '', tel: '', email: '', notas: '', step: 0
  };

  function trackEvent(name, data) {
    if (window.dataLayer) window.dataLayer.push({ event: name, ...data });
  }

  function waOpen(estName) {
    state.establecimiento = estName || '';
    state.plan = ''; state.adultos = 2; state.ninos = 0;
    state.fechaLlegada = ''; state.fechaSalida = '';
    state.nombre = ''; state.tel = ''; state.email = ''; state.notas = '';
    state.step = 1;

    document.querySelectorAll('.wa-choice.selected').forEach(b => b.classList.remove('selected'));
    ['waNombre','waTelefono','waEmail','waNotas','waHabeas','wa_honeypot','waFechaLlegada','waFechaSalida'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { if (id === 'waHabeas') el.checked = true; else el.value = ''; }
    });
    document.getElementById('waAdultosVal').textContent = '2';
    document.getElementById('waNinosVal').textContent = '0';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('waFechaLlegada').setAttribute('min', today);
    document.getElementById('waFechaSalida').setAttribute('min', today);

    document.getElementById('waModalEstName').textContent = estName || 'Sin compromiso · Respuesta rapida';
    document.getElementById('waSuccessStep').classList.remove('active');

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
    state.step = n;
    document.querySelectorAll('.wa-step').forEach(s => s.classList.remove('active'));
    const stepEl = document.querySelector(`.wa-step[data-wstep="${n}"]`);
    if (stepEl) stepEl.classList.add('active');

    document.querySelectorAll('.wa-dot').forEach(d => {
      d.classList.remove('active','done');
      if (+d.dataset.dot === n) d.classList.add('active');
      else if (+d.dataset.dot < n) d.classList.add('done');
    });

    const foot = document.getElementById('waModalFoot');
    if (n >= 5) {
      foot.style.display = 'none';
    } else {
      foot.style.display = '';
      document.getElementById('waBtnBack').style.display = n > 1 ? '' : 'none';
      document.getElementById('waBtnNext').style.display = n < 4 ? '' : 'none';
      document.getElementById('waBtnSubmit').style.display = n === 4 ? '' : 'none';
    }

    if (n === 4) waRenderSummary();
  }

  function waRenderSummary() {
    document.getElementById('waSumEstablecimiento').textContent = state.establecimiento || 'No especificado';
    document.getElementById('waSumPlan').textContent = state.plan;
    document.getElementById('waSumAdultos').textContent = state.adultos;
    document.getElementById('waSumNinos').textContent = state.ninos;
    document.getElementById('waSumNinosRow').style.display = state.ninos > 0 ? '' : 'none';
    document.getElementById('waSumFechaLlegada').textContent = formatDate(state.fechaLlegada) || 'No especificada';
    document.getElementById('waSumFechaSalida').textContent = formatDate(state.fechaSalida) || '—';
    document.getElementById('waSumSalidaRow').style.display = state.fechaSalida ? '' : 'none';
    document.getElementById('waSumNombre').textContent = state.nombre;
    document.getElementById('waSumTel').textContent = state.tel;
  }

  function formatDate(d) {
    if (!d) return '';
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const [y, m, day] = d.split('-');
    return `${parseInt(day)} de ${months[parseInt(m)-1]} de ${y}`;
  }

  function waValidate() {
    state.plan = state.plan || '';
    if (!state.plan) { showError('Por favor selecciona el tipo de plan'); return false; }
    if (state.adultos < 1) { showError('Debe haber al menos 1 adulto'); return false; }
    state.nombre = document.getElementById('waNombre').value.trim();
    state.tel = document.getElementById('waTelefono').value.trim().replace(/\D/g,'');
    state.fechaLlegada = document.getElementById('waFechaLlegada').value;
    state.fechaSalida = document.getElementById('waFechaSalida').value;
    state.email = document.getElementById('waEmail').value.trim();
    state.notas = document.getElementById('waNotas').value.trim();
    if (!state.nombre) { showError('Ingresa tu nombre completo'); return false; }
    if (state.tel.length < 7) { showError('Ingresa un numero de WhatsApp valido'); return false; }
    return true;
  }

  function showError(msg) {
    alert(msg);
  }

  async function waSubmit() {
    if (!waValidate()) return;
    const honeypot = document.getElementById('wa_honeypot')?.value;
    if (honeypot) { waClose(); return; }
    const habeasOk = document.getElementById('waHabeas').checked;
    if (!habeasOk) { showError('Debes aceptar la politica de tratamiento de datos'); return; }

    const btn = document.getElementById('waBtnSubmit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const payload = {
      session_id: sessionStorage.getItem('hsfa_session') || crypto.randomUUID(),
      establecimiento: state.establecimiento,
      tipo_plan: state.plan,
      personas: `${state.adultos} adultos` + (state.ninos > 0 ? `, ${state.ninos} ni&ntilde;os` : ''),
      fecha_estimada: state.fechaLlegada + (state.fechaSalida ? ' → ' + state.fechaSalida : ''),
      nombre: state.nombre,
      whatsapp_tel: state.tel,
      correo: state.email,
      preferencias: state.notas,
      habeas_data: true,
      habeas_data_timestamp: new Date().toISOString(),
      completado: true
    };

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads_hospedaje`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
    } catch (e) { console.warn('Supabase error:', e); }

    sessionStorage.setItem('hsfa_session', payload.session_id);
    trackEvent('whatsapp_disponibilidad_enviado', { establecimiento: state.establecimiento, tipo_plan: state.plan });

    // Build success message
    const estName = state.establecimiento || 'la hosteria';
    document.getElementById('waSuccessTitle').textContent = '¡Solicitud recibida!';
    document.getElementById('waSuccessMsg').innerHTML = 
      `Un asesor de <strong>${estName}</strong> te contactará en breve a tu WhatsApp <strong>${state.tel}</strong>.`;

    // Build WhatsApp link for the secondary CTA
    const waMsg = [
      `Hola! Vi ${state.establecimiento ? state.establecimiento + ' en' : ''} hosteriassantafe.com`,
      `Plan: ${state.plan} | Personas: ${state.adultos} adultos` + (state.ninos > 0 ? `, ${state.ninos} ninos` : ''),
      state.fechaLlegada ? `Fecha: ${formatDate(state.fechaLlegada)}` : '',
      `Nombre: ${state.nombre} | WhatsApp: ${state.tel}`,
      `Quiero confirmar disponibilidad.`
    ].filter(Boolean).join('\n');
    document.getElementById('waSuccessWA').href = `https://wa.me/${WA_DESTINO}?text=${encodeURIComponent(waMsg)}`;

    // Go to success step
    waSetStep(5);

    // Launch confetti
    launchConfetti();
  }

  /* ---- Confetti Animation ---- */
  function launchConfetti() {
    const canvas = document.getElementById('waConfetti');
    if (!canvas) return;
    const box = canvas.parentElement;
    canvas.width = box.offsetWidth;
    canvas.height = box.offsetHeight;
    const ctx = canvas.getContext('2d');

    const colors = ['#F5C800','#0A0A0A','#25D366','#DB9A2E','#E74C3C','#3498DB'];
    const particles = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 1,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.vy += 0.05;
        p.opacity -= 0.003;
        p.vx *= 0.99;
      });

      frame++;
      if (frame < 150) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(draw);
  }

  /* ---- Counter buttons ---- */
  document.querySelectorAll('.wa-counter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.counter;
      const action = btn.dataset.action;
      const valEl = document.getElementById(type === 'adultos' ? 'waAdultosVal' : 'waNinosVal');
      let val = parseInt(valEl.textContent);

      if (action === 'plus') val++;
      else val--;

      const min = type === 'adultos' ? 1 : 0;
      const max = type === 'adultos' ? 20 : 15;
      val = Math.max(min, Math.min(max, val));
      valEl.textContent = val;

      if (type === 'adultos') state.adultos = val;
      else state.ninos = val;

      // Update sibling button disabled state
      const row = btn.closest('.wa-counter-row');
      const minusBtn = row.querySelector('[data-action="minus"]');
      const plusBtn = row.querySelector('[data-action="plus"]');
      minusBtn.disabled = val <= min;
      plusBtn.disabled = val >= max;
    });
  });

  // Initialize button states
  document.querySelectorAll('.wa-counter-row').forEach(row => {
    const type = row.querySelector('.wa-counter__btn').dataset.counter;
    const valEl = document.getElementById(type === 'adultos' ? 'waAdultosVal' : 'waNinosVal');
    const val = parseInt(valEl.textContent);
    const min = type === 'adultos' ? 1 : 0;
    const max = type === 'adultos' ? 20 : 15;
    const minusBtn = row.querySelector('[data-action="minus"]');
    const plusBtn = row.querySelector('[data-action="plus"]');
    if (minusBtn) minusBtn.disabled = val <= min;
    if (plusBtn) plusBtn.disabled = val >= max;
  });

  /* ---- Choice buttons (step 1: plan) ---- */
  document.querySelectorAll('.wa-step[data-wstep="1"] .wa-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      parent.querySelectorAll('.wa-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.plan = btn.dataset.val;
      waSetStep(2);
    });
  });

  // Step 3: collect name+tel before advancing
  ['waNombre','waTelefono','waEmail','waNotas','waFechaLlegada','waFechaSalida','waPresupuesto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (id === 'waNombre') state.nombre = el.value.trim();
        if (id === 'waTelefono') state.tel = el.value.trim();
        if (id === 'waFechaLlegada') state.fechaLlegada = el.value;
        if (id === 'waFechaSalida') state.fechaSalida = el.value;
      });
    }
  });

  /* ---- Navigation buttons ---- */
  document.querySelectorAll('[data-wa-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const est = btn.dataset.waEstablecimiento || '';
      waOpen(est);
    });
  });

  document.querySelectorAll('[data-wa-close]').forEach(el => {
    el.addEventListener('click', waClose);
  });

  document.getElementById('waBtnNext').addEventListener('click', () => {
    const current = state.step;
    if (current === 1 && !state.plan) { showError('Selecciona un tipo de plan'); return; }
    if (current === 2) {
      state.adultos = parseInt(document.getElementById('waAdultosVal').textContent);
      state.ninos = parseInt(document.getElementById('waNinosVal').textContent);
      if (state.adultos < 1) { showError('Debe haber al menos 1 adulto'); return; }
    }
    if (current === 3) {
      const n = document.getElementById('waNombre').value.trim();
      const t = document.getElementById('waTelefono').value.trim();
      if (!n) { showError('Ingresa tu nombre completo'); return; }
      if (t.replace(/\D/g,'').length < 7) { showError('Ingresa un WhatsApp valido'); return; }
    }
    waSetStep(Math.min(current + 1, 4));
  });

  document.getElementById('waBtnBack').addEventListener('click', () => {
    waSetStep(Math.max(state.step - 1, 1));
  });

  document.getElementById('waBtnSubmit').addEventListener('click', waSubmit);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) waClose();
  });

  // Float button on detail pages
  const floatWA = document.querySelector('.float-wa');
  if (floatWA) {
    floatWA.addEventListener('click', function(e) {
      const estName = this.dataset.waEstablecimiento || document.querySelector('h1')?.textContent?.trim() || '';
      if (estName) { e.preventDefault(); waOpen(estName); }
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
