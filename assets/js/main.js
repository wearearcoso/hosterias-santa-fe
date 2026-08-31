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

/* ---- Hamburger + Mega Menu ---- */
(function () {
  const btn    = document.querySelector('.hamburger-btn');
  const menu   = document.querySelector('.field-menu');
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

  // Menu group accordion
  document.querySelectorAll('.menu-group-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const group = trigger.closest('.menu-group');
      group.classList.toggle('open');
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

/* ---- FAQ Accordion ---- */
(function () {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      trigger.setAttribute('aria-expanded', !isOpen);
      if (isOpen) {
        item.classList.remove('open');
        item.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('open');
        item.querySelector('.faq-answer').removeAttribute('aria-hidden');
      }
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

  /* ---- Resultados Grid (Home) ---- */
  initResultadosGrid();

  /* ---- Inspiration Carousel (Variante A) ---- */
  initInspirationCarousel();

  /* ---- Compact Carousel Día de Sol (Variante C) ---- */
  initCompactCarousel();

  /* ---- Hero chip bar + bottom-sheet filtros ---- */
  initHeroChips();
  initBottomSheet();
});

/* ---- Resultados Grid Data & Render ---- */
var ESTABLECIMIENTOS_DATA = [
  { id:"florida-tropical",  name:"Hostería Florida Tropical",      cat:"hosterias", stars:"4.5", ratingSrc:"Google",      price:"$87.000",  unit:"persona", tags:"Lago,Piscina,Kayak",         amText:"Lago · 3 Piscinas · Kayak · Todo incluido",       url:"/hosteria-florida-tropical",      img1:"florida-tropical-02", img2:"florida-tropical-03", img3:"florida-tropical-04", tagline:"El lago más grande del occidente antioqueño. Kayak, pesca y todo incluido.", desc:"El lago más grande del occidente antioqueño, 3 piscinas, kayak, pesca deportiva y planes todo incluido para familias y parejas." },
  { id:"tonusco-campestre", name:"Hostería Tonusco Campestre",      cat:"hosterias", stars:"4.4", ratingSrc:"Google",      price:"$120.000", unit:"persona", tags:"Jacuzzi,Cabañas,Spa",         amText:"33 Cabañas · Jacuzzi · Spa · Minigolf",            url:"/hosteria-tonusco-campestre",     img1:"tonusco-cabana",      img2:"tonusco-cabanas",      img3:"tonusco-piscina",       tagline:"33 cabañas con jacuzzi, spa y música en vivo los fines de semana.", desc:"33 cabañas con jacuzzi, spa, minigolf y artista en vivo los fines de semana. Cerca del parque principal de Santa Fe." },
  { id:"fundadores",        name:"Hostería Fundadores",             cat:"hosterias", stars:"4.2", ratingSrc:"Google",      price:"$87.000",  unit:"persona", tags:"Económica,Central,Piscina",   amText:"Central · Piscina · Restaurante · WiFi",           url:"/hosteria-fundadores",            img1:"fundadores-01",       img2:"fundadores-02",        img3:"fundadores-03",         tagline:"Céntrica, familiar y con buena piscina. La mejor relación calidad-precio.", desc:"Ubicación céntrica a 7 cuadras del Parque Principal, ambiente familiar y precios accesibles desde $87.000." },
  { id:"castellano",        name:"Hostería El Castellano",          cat:"hosterias", stars:"4.1", ratingSrc:"Google",      price:"$90.000",  unit:"persona", tags:"Campestre,Piscina,Naturaleza", amText:"Campestre · 4 km del centro · Piscina · Zonas verdes", url:"/hosteria-el-castellano",        img1:"castellano-01",       img2:"castellano-03",        img3:"castellano-05",         tagline:"Naturaleza y calma a 4 km del centro histórico. Perfecto para desconectar.", desc:"Ambiente campestre tranquilo a solo 4 kilómetros del centro histórico. Ideal para desconexión total." },
  { id:"ivanna",            name:"Ivanna Hotel Campestre",          cat:"hosterias", stars:"4.5", ratingSrc:"Google",      price:"$160.000", unit:"persona", tags:"Todo incluido,Piscina,Lujo",  amText:"4.5★ · Todo incluido · Piscina · Actividades",     url:"/ivanna-hotel-campestre",         img1:"ivanna-02",           img2:"ivanna-03",            img3:"ivanna-04",             tagline:"Todo incluido premium con piscina, alimentación y actividades ilimitadas.", desc:"4.5 estrellas, todo incluido con piscina, alimentación y actividades. Atención personalizada." },
  { id:"mariscal-robledo",  name:"Hotel Mariscal Robledo",          cat:"hoteles",   stars:"4.7", ratingSrc:"TripAdvisor", price:"$320.000", unit:"noche",   tags:"TripAdvisor,Colonial,Spa",   amText:"4.7★ TripAdvisor · Colonial · Piscina · Spa · Gourmet", url:"/hotel-mariscal-robledo",        img1:"mariscal-robledo-05", img2:"mariscal-robledo-05",  img3:"mariscal-robledo-05",   tagline:"El más valorado de Santa Fe. Colonial, spa y restaurante gourmet.", desc:"4.7★ en TripAdvisor. Arquitectura colonial, piscina, spa y restaurante gourmet en el centro histórico." },
  { id:"porton-del-sol",    name:"Hotel Portón del Sol",            cat:"hoteles",   stars:"4.3", ratingSrc:"Google",      price:"$250.000", unit:"noche",   tags:"60 habs,Suites,Eventos",     amText:"60 Habitaciones · 16 Suites · Piscina · Eventos",  url:"/hotel-porton-del-sol",           img1:"porton-del-sol-01",   img2:"porton-del-sol-02",    img3:"porton-del-sol-03",     tagline:"El de mayor capacidad. Suites, piscina y salas de eventos.", desc:"El hotel con mayor capacidad de Santa Fe. 60 habitaciones, 16 suites, piscina y espacios para eventos." },
  { id:"guaracu",           name:"Casa Hotel Guaracú",              cat:"hoteles",   stars:"4.2", ratingSrc:"Google",      price:"$180.000", unit:"noche",   tags:"Bicicletas,Boutique,Piscina", amText:"Bicicletas gratis · Piscina · Desayuno · Boutique", url:"/casa-hotel-guaracu",             img1:"guaracu-01",          img2:"guaracu-02",           img3:"guaracu-03",            tagline:"Boutique con bicicletas gratuitas, piscina y desayuno. Experiencia auténtica.", desc:"Hotel boutique con bicicletas gratuitas, piscina y desayuno incluido. Una experiencia auténtica." },
  { id:"nueva-granada",     name:"Nueva Granada Hotel Colonial",   cat:"hoteles",   stars:"4.2", ratingSrc:"TripAdvisor", price:"$190.000", unit:"noche",   tags:"Colonial,Céntrico,TripAdvisor", amText:"4.2★ TripAdvisor · Colonial · Centro histórico", url:"/nueva-granada-hotel-colonial",   img1:"nueva-granada-02",    img2:"nueva-granada-03",     img3:"nueva-granada-04",      tagline:"Casona colonial en pleno centro histórico, de los mejor valorados.", desc:"Uno de los mejor valorados. Arquitectura colonial en el centro histórico con atención personalizada." }
];

var DIA_DE_SOL_DATA = [
  { id:"ds-florida",    name:"Día de Sol en Florida Tropical",       cat:"dia-de-sol", stars:"4.5", ratingSrc:"Google", price:"$85.000", unit:"persona", tags:"Lago,Piscina,Kayak",       amText:"Lago · 3 Piscinas · Kayak · Almuerzo incluido", url:"/hosteria-florida-tropical",  img1:"florida-tropical-02", img2:"florida-tropical-03", img3:"florida-tropical-05", desc:"Pasadía con acceso al lago más grande del occidente antioqueño, 3 piscinas, kayak y almuerzo típico." },
  { id:"ds-tonusco",   name:"Día de Sol en Tonusco Campestre",      cat:"dia-de-sol", stars:"4.4", ratingSrc:"Google", price:"$90.000", unit:"persona", tags:"Jacuzzi,Cabañas,Piscina", amText:"Jacuzzi · Piscina · Cabañas · Almuerzo",        url:"/hosteria-tonusco-campestre", img1:"tonusco-jacuzzi",     img2:"tonusco-piscina",      img3:"tonusco-hamacas",       desc:"Pasadía con acceso a piscina, jacuzzi, zonas húmedas y almuerzo. Muy recomendado para familias." },
  { id:"ds-fundadores",name:"Día de Sol en Hostería Fundadores",    cat:"dia-de-sol", stars:"4.2", ratingSrc:"Google", price:"$75.000", unit:"persona", tags:"Económica,Central,Piscina",amText:"Económica · Central · Piscina · Almuerzo",       url:"/hosteria-fundadores",        img1:"fundadores-04",       img2:"fundadores-05",        img3:"fundadores-01",         desc:"Piscina, almuerzo típico y ubicación céntrica a 7 cuadras del Parque Principal." },
];

function priceRange(e) {
  var n = parseInt(e.price.replace(/\D/g, ''), 10);
  if (n < 90000) return 'low';
  if (n <= 160000) return 'mid';
  return 'high';
}

/* ---- Variante B: Tarjeta resultado (con galería in-card) ---- */
function buildCard(e) {
  var tags = e.tags.split(',').slice(0, 3).map(function(t) {
    return '<span class="r-tag">'+t.trim()+'</span>';
  }).join('');
  var catLabel = e.cat==='dia-de-sol' ? 'Día de sol' : e.cat==='hosterias' ? 'Hostería' : 'Hotel';
  var imgs = [e.img1, e.img2, e.img3].filter(Boolean).join(',');
  return '<article class="resultado-card" data-categoria="'+e.cat+'" data-price-range="'+priceRange(e)+'" data-tags="'+e.tags.toLowerCase()+'">'
    + '<a href="'+e.url+'" class="rc-img-wrap" data-imgs="'+imgs+'" tabindex="-1" aria-hidden="true">'
    + '<img src="assets/images/'+e.img1+'.webp" alt="'+e.name+'" loading="lazy" width="400" height="300">'
    + '<div class="rc-badge-rating"><svg width="12" height="12" viewBox="0 0 24 24" fill="#E8B600"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'+e.stars+'</div>'
    + '<div class="rc-cat-badge">'+catLabel+'</div>'
    + '</a>'
    + '<div class="rc-body">'
    + '<div class="rc-tags">'+tags+'</div>'
    + '<h3 class="rc-name"><a href="'+e.url+'">'+e.name+'</a></h3>'
    + '<p class="rc-amenities">'+e.amText+'</p>'
    + '<p class="rc-desc">'+e.desc+'</p>'
    + '</div>'
    + '<div class="rc-footer">'
    + '<div class="rc-price"><span class="rc-price-label">Desde</span><span class="rc-price-val">'+e.price+'</span><span class="rc-price-unit">/'+e.unit+'</span></div>'
    + '<div class="rc-actions">'
    + '<button class="rc-btn-consult" data-lw-open data-lw-property-id="'+e.id+'" data-lw-property-name="'+e.name+'">Consultar</button>'
    + '<a href="'+e.url+'" class="rc-btn-detail">Ver →</a>'
    + '</div>'
    + '</div>'
    + '</article>';
}

/* ---- Variante A: Tarjeta inspiración ---- */
function buildInspirationCard(e) {
  var catLabel = e.cat==='hosterias' ? 'Hostería' : 'Hotel';
  return '<a href="'+e.url+'" class="card-inspira" data-lw-open data-lw-property-id="'+e.id+'" data-lw-property-name="'+e.name+'" role="article">'
    + '<img src="assets/images/'+e.img1+'.webp" alt="'+e.name+'" loading="lazy" width="340" height="453">'
    + '<div class="card-inspira-overlay" aria-hidden="true"></div>'
    + '<span class="card-inspira-badge">'+catLabel+'</span>'
    + '<div class="card-inspira-body">'
    + '<h3 class="card-inspira-name">'+e.name+'</h3>'
    + '<p class="card-inspira-tagline">'+(e.tagline || e.desc)+'</p>'
    + '<div class="card-inspira-meta">'
    + '<div class="card-inspira-price"><span class="card-inspira-price-from">Desde</span><span class="card-inspira-price-val">'+e.price+'</span> <span class="card-inspira-price-unit">/'+e.unit+'</span></div>'
    + '<button class="card-inspira-cta" aria-label="Consultar '+e.name+'">Consultar</button>'
    + '</div>'
    + '</div>'
    + '</a>';
}

/* ---- Variante C: Tarjeta compacta ---- */
function buildCompactCard(e) {
  return '<a href="'+e.url+'" class="card-compact">'
    + '<div class="card-compact-img"><img src="assets/images/'+e.img1+'.webp" alt="'+e.name+'" loading="lazy" width="80" height="80"></div>'
    + '<div class="card-compact-info">'
    + '<p class="card-compact-name">'+e.name+'</p>'
    + '<p class="card-compact-am">'+e.amText+'</p>'
    + '<p class="card-compact-price">'+e.price+' <span>/'+e.unit+'</span></p>'
    + '</div>'
    + '</a>';
}

/* ---- Galería in-card: swipe + flechas (Variante B) ---- */
function initCardGalleries() {
  document.querySelectorAll('.rc-img-wrap[data-imgs]').forEach(function(wrap) {
    var imgs = wrap.dataset.imgs.split(',').filter(Boolean);
    if (imgs.length < 2) return;
    var imgEl = wrap.querySelector('img');
    var idx = 0;

    // Dots
    var dotsEl = document.createElement('div');
    dotsEl.className = 'rc-gallery-dots';
    imgs.forEach(function(_, i) {
      var d = document.createElement('span');
      d.className = 'rc-gallery-dot' + (i === 0 ? ' active' : '');
      dotsEl.appendChild(d);
    });
    wrap.appendChild(dotsEl);

    function goTo(n) {
      idx = ((n % imgs.length) + imgs.length) % imgs.length;
      imgEl.src = 'assets/images/' + imgs[idx].trim() + '.webp';
      dotsEl.querySelectorAll('.rc-gallery-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === idx);
      });
    }

    // Nav arrows
    ['prev', 'next'].forEach(function(dir) {
      var btn = document.createElement('button');
      btn.className = 'rc-gallery-nav rc-gallery-' + dir;
      btn.innerHTML = dir === 'prev' ? '&#8249;' : '&#8250;';
      btn.setAttribute('aria-label', dir === 'prev' ? 'Foto anterior' : 'Foto siguiente');
      btn.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        goTo(idx + (dir === 'next' ? 1 : -1));
      });
      wrap.appendChild(btn);
    });

    // Touch swipe
    var startX = 0;
    wrap.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    wrap.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  });
}

function initResultadosGrid() {
  var grid = document.getElementById('resultadosGrid');
  if (!grid) return;
  var all = ESTABLECIMIENTOS_DATA.concat(DIA_DE_SOL_DATA);
  grid.innerHTML = all.map(buildCard).join('');
  grid.querySelectorAll('.resultado-card').forEach(function(card, i) {
    card.style.setProperty('--i', i);
  });
  initCardGalleries();
}

/* ---- Inspiration Carousel (Variante A) ---- */
function initInspirationCarousel() {
  var wrap = document.getElementById('inspiraCarousel');
  if (!wrap) return;
  // Top 6 by stars/appeal
  var featured = ESTABLECIMIENTOS_DATA.slice(0, 6);
  wrap.innerHTML = featured.map(buildInspirationCard).join('');
}

/* ---- Compact Carousel: Día de Sol (Variante C) ---- */
function initCompactCarousel() {
  var wrap = document.getElementById('compactCarouselDiaSol');
  if (!wrap) return;
  wrap.innerHTML = DIA_DE_SOL_DATA.map(buildCompactCard).join('');
}

/* ---- Hero chip bar (quick category filter) ---- */
function initHeroChips() {
  var chips = document.querySelectorAll('.hc-chip[data-filter]');
  if (!chips.length) return;

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('hc-chip--active'); });
      chip.classList.add('hc-chip--active');
      var filter = chip.dataset.filter;
      applyFilters({ cat: filter });
      var sec = document.getElementById('resultados');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---- Bottom-sheet filtros ---- */
var _activeFilters = { cat: 'todas', budget: null, amenidades: [] };

function applyFilters(overrides) {
  if (overrides) Object.assign(_activeFilters, overrides);
  var f = _activeFilters;

  document.querySelectorAll('.resultado-card').forEach(function(card) {
    var catOk = f.cat === 'todas' || card.dataset.categoria === f.cat;
    var budgetOk = !f.budget || card.dataset.priceRange === f.budget;
    var amOk = !f.amenidades.length || f.amenidades.every(function(am) {
      return (card.dataset.tags || '').indexOf(am.toLowerCase()) !== -1;
    });
    card.style.display = catOk && budgetOk && amOk ? '' : 'none';
  });

  // Update apply button count
  var visible = document.querySelectorAll('.resultado-card:not([style*="none"])').length;
  var btn = document.getElementById('bsApplyBtn');
  if (btn) btn.textContent = 'Ver ' + visible + ' resultado' + (visible !== 1 ? 's' : '');

  // Badge on filter chip
  var filterChip = document.getElementById('heroFiltrosBtn');
  if (filterChip) {
    var hasExtra = f.budget || f.amenidades.length;
    filterChip.classList.toggle('has-filters', !!hasExtra);
    var badge = filterChip.querySelector('.bs-badge');
    if (badge) badge.textContent = (f.budget ? 1 : 0) + f.amenidades.length || '';
  }
}

function initBottomSheet() {
  var sheet = document.getElementById('filtrosSheet');
  if (!sheet) return;

  var openBtn = document.getElementById('heroFiltrosBtn');
  var closeBtn = sheet.querySelector('.bs-close-btn');
  var overlay = sheet.querySelector('.bs-overlay');
  var applyBtn = document.getElementById('bsApplyBtn');

  function open() { sheet.removeAttribute('hidden'); requestAnimationFrame(function() { sheet.classList.add('bs-open'); }); document.body.style.overflow = 'hidden'; }
  function close() { sheet.classList.remove('bs-open'); document.body.style.overflow = ''; setTimeout(function() { sheet.setAttribute('hidden', ''); }, 350); }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  // Category chips inside sheet
  sheet.querySelectorAll('.bs-chip[data-cat]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      sheet.querySelectorAll('.bs-chip[data-cat]').forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      // Also sync hero chips
      document.querySelectorAll('.hc-chip[data-filter]').forEach(function(hc) {
        hc.classList.toggle('hc-chip--active', hc.dataset.filter === chip.dataset.cat);
      });
      applyFilters({ cat: chip.dataset.cat });
    });
  });

  // Budget chips inside sheet
  sheet.querySelectorAll('.bs-chip[data-budget]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var already = chip.classList.contains('active');
      sheet.querySelectorAll('.bs-chip[data-budget]').forEach(function(c) { c.classList.remove('active'); });
      if (!already) { chip.classList.add('active'); applyFilters({ budget: chip.dataset.budget }); }
      else { applyFilters({ budget: null }); }
    });
  });

  // Amenidades checkboxes
  sheet.querySelectorAll('.bs-am-check').forEach(function(cb) {
    cb.addEventListener('change', function() {
      _activeFilters.amenidades = Array.from(sheet.querySelectorAll('.bs-am-check:checked')).map(function(c) { return c.value; });
      applyFilters();
    });
  });

  // Apply & close
  if (applyBtn) applyBtn.addEventListener('click', function() {
    close();
    var sec = document.getElementById('resultados');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  });

  // Keyboard close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sheet.classList.contains('bs-open')) close();
  });

  // Initial count
  applyFilters();
}

/* ---- Legacy filter (disabled — replaced by chips + bottom-sheet) ---- */
var searchBtn = document.getElementById('heroSearchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', function() {
    var cat = document.getElementById('heroSelect').value;
    applyFilters({ cat: cat });
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
  });
}
