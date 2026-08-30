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
});

/* ---- Resultados Grid Data & Render ---- */
var ESTABLECIMIENTOS_DATA = [
  { id:"florida-tropical", name:"Hostería Florida Tropical", cat:"hosterias", stars:"4.5", ratingSrc:"Google", price:"$87.000", unit:"persona", tags:"Lago,Piscina,Kayak", amText:"Lago · 3 Piscinas · Kayak · Todo incluido", url:"hosteria-florida-tropical.html", img1:"florida-tropical-02", img2:"florida-tropical-03", img3:"florida-tropical-04", desc:"El lago más grande del occidente antioqueño, 3 piscinas, kayak, pesca deportiva y planes todo incluido para familias y parejas." },
  { id:"tonusco-campestre", name:"Hostería Tonusco Campestre", cat:"hosterias", stars:"4.4", ratingSrc:"Google", price:"$120.000", unit:"persona", tags:"Jacuzzi,Cabañas,Spa", amText:"33 Cabañas · Jacuzzi · Spa · Minigolf", url:"hosteria-tonusco-campestre.html", img1:"tonusco-cabana", img2:"tonusco-cabanas", img3:"tonusco-piscina", desc:"33 cabañas con jacuzzi, spa, minigolf y artista en vivo los fines de semana. Cerca del parque principal de Santa Fe." },
  { id:"fundadores", name:"Hostería Fundadores", cat:"hosterias", stars:"4.2", ratingSrc:"Google", price:"$87.000", unit:"persona", tags:"Económica,Central,Piscina", amText:"Central · Piscina · Restaurante · WiFi", url:"hosteria-fundadores.html", img1:"fundadores-01", img2:"fundadores-02", img3:"fundadores-03", desc:"Ubicación céntrica a 7 cuadras del Parque Principal, ambiente familiar y precios accesibles desde $87.000." },
  { id:"real", name:"Hostería Real", cat:"hosterias", stars:"4.0", ratingSrc:"Google", price:"$110.000", unit:"persona", tags:"Piscina,Bar,Restaurante", amText:"Piscina · Bar · Restaurante · Ambiente festivo", url:"hosteria-real.html", img1:"real-01", img2:"real-02", img3:"real-03", desc:"Bar-restaurante con piscina y ambiente animado. Perfecto para grupos de amigos y celebraciones." },
  { id:"castellano", name:"Hostería El Castellano", cat:"hosterias", stars:"4.1", ratingSrc:"Google", price:"$90.000", unit:"persona", tags:"Campestre,Piscina,Naturaleza", amText:"Campestre · 4 km del centro · Piscina · Zonas verdes", url:"hosteria-el-castellano.html", img1:"castellano-01", img2:"castellano-03", img3:"castellano-05", desc:"Ambiente campestre tranquilo a solo 4 kilómetros del centro histórico. Ideal para desconexión total." },
  { id:"bohios", name:"Hostería Bohíos Bar", cat:"hosterias", stars:"3.9", ratingSrc:"Google", price:"$80.000", unit:"persona", tags:"Piscina,Lounge,Bar", amText:"Piscina · Lounge · Bar · Día de sol", url:"hosteria-bohios-bar.html", img1:"bohios-01", img2:"bohios-02", img3:"bohios-03", desc:"Piscina con lounge bar y ambiente animado. Ideal para grupos de amigos y celebraciones." },
  { id:"paraiso", name:"Hostería Paraíso de Santa Fe", cat:"hosterias", stars:"4.0", ratingSrc:"Google", price:"$90.000", unit:"persona", tags:"Familiar,Piscina,Económica", amText:"Familiar · Piscina · Zonas verdes · Restaurante", url:"hosteria-paraiso-santa-fe.html", img1:"paraiso-01", img2:"paraiso-03", img3:"paraiso-04", desc:"Ambiente familiar con piscina, zonas verdes y restaurante de comida casera. Perfecto para familias." },
  { id:"ivanna", name:"Ivanna Hotel Campestre", cat:"hosterias", stars:"4.5", ratingSrc:"Google", price:"$160.000", unit:"persona", tags:"4.5★,Todo incluido,Campestre", amText:"4.5★ · Todo incluido · Piscina · Actividades", url:"ivanna-hotel-campestre.html", img1:"ivanna-02", img2:"ivanna-03", img3:"ivanna-04", desc:"4.5 estrellas, todo incluido con piscina, alimentación y actividades. Atención personalizada." },
  { id:"palser", name:"Finca Hotel Tropical PalSer", cat:"hosterias", stars:"4.3", ratingSrc:"Google", price:"$490.000", unit:"noche", tags:"Resort,Lujo,Privacidad", amText:"Resort · Lujo · Privacidad · Naturaleza", url:"finca-hotel-tropical-palser.html", img1:"palser-01", img2:"palser-02", img3:"palser-03", desc:"Resort privado de lujo rodeado de naturaleza. La opción más exclusiva de Santa Fe de Antioquia." },
  { id:"mariscal-robledo", name:"Hotel Mariscal Robledo", cat:"hoteles", stars:"4.7", ratingSrc:"TripAdvisor", price:"$320.000", unit:"noche", tags:"#1 TripAdvisor,Colonial,Spa", amText:"#1 TripAdvisor · Colonial · Piscina · Spa · Gourmet", url:"hotel-mariscal-robledo.html", img1:"mariscal-robledo-05", img2:"mariscal-robledo-05", img3:"mariscal-robledo-05", desc:"#1 en TripAdvisor con 4.7★. Arquitectura colonial, piscina, spa y restaurante gourmet en el centro histórico." },
  { id:"porton-del-sol", name:"Hotel Portón del Sol", cat:"hoteles", stars:"4.3", ratingSrc:"Google", price:"$250.000", unit:"noche", tags:"60 habs,16 suites,Piscina", amText:"60 Habitaciones · 16 Suites · Piscina · Eventos", url:"hotel-porton-del-sol.html", img1:"porton-del-sol-01", img2:"porton-del-sol-02", img3:"porton-del-sol-03", desc:"El hotel con mayor capacidad de Santa Fe. 60 habitaciones, 16 suites, piscina y espacios para eventos." },
  { id:"santa-fe-parque", name:"Hotel Santa Fe del Parque", cat:"hoteles", stars:"3.8", ratingSrc:"Google", price:"$80.000", unit:"noche", tags:"Económico,Central,Cómodo", amText:"Económico · Central · Frente al parque", url:"hotel-santa-fe-del-parque.html", img1:"santa-fe-parque-01", img2:"santa-fe-parque-02", img3:"santa-fe-parque-03", desc:"La opción más económica y mejor ubicada del centro histórico. Habitaciones cómodas frente al Parque Principal." },
  { id:"santa-barbara", name:"Hotel Santa Barbara Colonial", cat:"hoteles", stars:"4.0", ratingSrc:"Google", price:"$95.000", unit:"noche", tags:"Colonial,Económico,Desayuno", amText:"Colonial · Económico · Desayuno · Céntrico", url:"hotel-santa-barbara-colonial.html", img1:"santa-barbara-01", img2:"santa-barbara-02", img3:"santa-barbara-03", desc:"Casona colonial restaurada con el encanto de la arquitectura tradicional antioqueña. Desayuno incluido." },
  { id:"iguana", name:"Hotel La Iguana", cat:"hoteles", stars:"3.9", ratingSrc:"Google", price:"$90.000", unit:"noche", tags:"Encanto,Jardines,Cómodo", amText:"Jardines · Cómodo · WiFi · Buena ubicación", url:"hotel-la-iguana.html", img1:"iguana-01", img2:"iguana-02", img3:"iguana-03", desc:"Hotel con encanto y jardines tropicales. Habitaciones cómodas con atención cálida y personalizada." },
  { id:"guaracu", name:"Casa Hotel Guaracú", cat:"hoteles", stars:"4.2", ratingSrc:"Google", price:"$180.000", unit:"noche", tags:"Bicicletas,Boutique,Piscina", amText:"Bicicletas gratis · Piscina · Desayuno · Boutique", url:"casa-hotel-guaracu.html", img1:"guaracu-01", img2:"guaracu-02", img3:"guaracu-03", desc:"Hotel boutique con bicicletas gratuitas, piscina y desayuno incluido. Una experiencia auténtica." },
  { id:"nueva-granada", name:"Nueva Granada Hotel Colonial", cat:"hoteles", stars:"4.2", ratingSrc:"TripAdvisor", price:"$190.000", unit:"noche", tags:"4.2★,Colonial,Céntrico", amText:"4.2★ TripAdvisor · Colonial · Centro histórico", url:"nueva-granada-hotel-colonial.html", img1:"nueva-granada-02", img2:"nueva-granada-03", img3:"nueva-granada-04", desc:"Uno de los mejor valorados. Arquitectura colonial en el centro histórico con atención personalizada." },
  { id:"selva-maria", name:"Selva María Hotel Boutique", cat:"hoteles", stars:"4.1", ratingSrc:"Google", price:"$210.000", unit:"noche", tags:"Boutique,Exclusivo,Personalizado", amText:"Boutique · Exclusivo · Atención personalizada", url:"selva-maria-hotel-boutique.html", img1:"selva-maria-01", img2:"selva-maria-02", img3:"selva-maria-03", desc:"Hotel boutique exclusivo con pocas habitaciones y atención ultra personalizada. Para viajeros exigentes." }
];

var DIA_DE_SOL_DATA = [
  { id:"ds-florida", name:"Día de Sol en Florida Tropical", cat:"dia-de-sol", stars:"4.5", ratingSrc:"Google", price:"$85.000", unit:"persona", tags:"Lago,Piscina,Kayak", amText:"Lago · 3 Piscinas · Kayak · Almuerzo incluido", url:"hosteria-florida-tropical.html", img1:"florida-tropical-02", img2:"florida-tropical-03", img3:"florida-tropical-05", desc:"Pasadía con acceso al lago más grande del occidente antioqueño, 3 piscinas, kayak y almuerzo típico." },
  { id:"ds-tonusco", name:"Día de Sol en Tonusco Campestre", cat:"dia-de-sol", stars:"4.4", ratingSrc:"Google", price:"$90.000", unit:"persona", tags:"Jacuzzi,Cabañas,Piscina", amText:"Jacuzzi · Piscina · Cabañas · Almuerzo", url:"hosteria-tonusco-campestre.html", img1:"tonusco-jacuzzi", img2:"tonusco-piscina", img3:"tonusco-hamacas", desc:"Pasadía con acceso a piscina, jacuzzi, zonas húmedas y almuerzo. El favorito de las familias." },
  { id:"ds-fundadores", name:"Día de Sol en Hostería Fundadores", cat:"dia-de-sol", stars:"4.2", ratingSrc:"Google", price:"$75.000", unit:"persona", tags:"Económica,Central,Piscina", amText:"Económica · Central · Piscina · Almuerzo", url:"hosteria-fundadores.html", img1:"fundadores-04", img2:"fundadores-05", img3:"fundadores-01", desc:"El día de sol más económico de Santa Fe. Piscina, almuerzo típico y a solo 7 cuadras del parque." },
  { id:"ds-real", name:"Día de Sol en Hostería Real", cat:"dia-de-sol", stars:"4.0", ratingSrc:"Google", price:"$85.000", unit:"persona", tags:"Piscina,Bar,Animado", amText:"Piscina · Bar · Almuerzo · Ambiente festivo", url:"hosteria-real.html", img1:"real-04", img2:"real-05", img3:"real-01", desc:"Pasadía con piscina, bar y almuerzo. Ambiente animado, perfecto para grupos de amigos." },
];

function buildCard(e) {
  return '<article class="resultado-card" data-categoria="'+e.cat+'">'
    + '<a href="'+e.url+'" class="resultado-card-img-stack">'
    + '<div class="img-back img-back-1"><img src="assets/images/'+e.img1+'.webp" alt="'+e.name+'" loading="lazy"></div>'
    + '<div class="img-back img-back-2"><img src="assets/images/'+e.img2+'.webp" alt="" aria-hidden="true" loading="lazy"></div>'
    + '<div class="img-main"><img src="assets/images/'+e.img3+'.webp" alt="'+e.name+'" loading="lazy"></div>'
    + '<div class="r-badge-rating"><svg width="13" height="13" viewBox="0 0 24 24" fill="#E8B600"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> '+e.stars+'</div>'
    + '</a>'
    + '<div class="resultado-card-body">'
    + '<div class="r-tags">'+e.tags.split(',').map(function(t){return '<span class="r-tag">'+t.trim()+'</span>';}).join('')+'</div>'
    + '<a href="'+e.url+'" class="r-name">'+e.name+'</a>'
    + '<div class="r-amenities-text">'+e.amText+'</div>'
    + '<p class="r-desc">'+e.desc+'</p>'
    + '</div>'
    + '<div class="resultado-card-footer">'
    + '<div><span class="r-price-label">Desde</span><span class="r-price-val">'+e.price+' /'+e.unit+'</span></div>'
    + '<div class="r-actions">'
    + '<button type="button" class="btn-consult" data-lw-open data-lw-property-id="'+e.id+'" data-lw-property-name="'+e.name+'">Consultar</button>'
    + '<a href="'+e.url+'" class="r-ver-btn">Ver detalles</a>'
    + '</div>'
    + '</div>'
    + '</article>';
}

function initResultadosGrid() {
  var grid = document.getElementById('resultadosGrid');
  if (!grid) return;
  var all = ESTABLECIMIENTOS_DATA.concat(DIA_DE_SOL_DATA);
  grid.innerHTML = all.map(buildCard).join('');
}

/* Filter by category */
var searchBtn = document.getElementById('heroSearchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', function() {
    var cat = document.getElementById('heroSelect').value;
    document.querySelectorAll('.resultado-card').forEach(function(card) {
      if (cat === 'todas' || card.dataset.categoria === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
  });
}
