/* ─── PHOTO DATA ──────────────────────────────────────────── */
const photoList = [
  { src: 'photos/waterfall.jpg',     category: 'nature',       info: 'IMG_0042.RAW — Cachoeira, Mata Atlântica' },
  { src: 'photos/centro-sp.jpg',     category: 'architecture', info: 'IMG_0108.RAW — Centro SP, Pôr do Sol' },
  { src: 'photos/vila-madalena.jpg', category: 'street',       info: 'IMG_0237.RAW — SP, Urbano' },
  { src: 'photos/parque.jpg',        category: 'nature',       info: 'IMG_0391.RAW — Mata Atlântica, Floresta' },
  { src: 'photos/pinacoteca.jpg',    category: 'night',        info: 'IMG_0502.RAW — SP, Noite' },
  { src: 'photos/liberdade.jpg',     category: 'street',       info: 'IMG_0618.RAW — SP, Crepúsculo' },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── CURSOR ──────────────────────────────────────────────── */
const cur  = document.getElementById('cursor');
const curR = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && curR) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
}

/* ─── PARALLAX ────────────────────────────────────────────── */
const heroBg = document.getElementById('hero-bg');
if (heroBg && !reducedMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        heroBg.style.transform = `scale(1.05) translateY(${sy * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── BOOT SEQUENCE ───────────────────────────────────────── */
const bootLines = [
  'PAIVA OS v2.6.0 — Photography Stack',
  '─────────────────────────────────────',
  'Initializing visual renderer.......... OK',
  'Loading gallery module................. OK',
  'Mounting filesystem /photos............ OK',
  `Found ${photoList.length} RAW frames in /gallery......... OK`,
  'Calibrating color profile (sRGB)....... OK',
  '─────────────────────────────────────',
  'Ready.',
  '',
  '> Welcome to paiva.portfolio',
];

const bootEl  = document.getElementById('boot-text');
const bootDiv = document.getElementById('boot');

function dismissBoot() {
  if (!bootDiv) return;
  bootDiv.classList.add('fade-out');
  setTimeout(() => bootDiv.style.display = 'none', 900);
}

if (bootDiv && bootEl && !reducedMotion) {
  bootDiv.addEventListener('click', dismissBoot);
  (async function runBoot() {
    let skipped = false;
    bootDiv.addEventListener('click', () => { skipped = true; }, { once: true });
    for (const text of bootLines) {
      if (skipped) break;
      await new Promise(r => setTimeout(r, 90));
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = text || ' ';
      bootEl.appendChild(line);
      void line.offsetWidth;
      line.style.opacity = '1';
    }
    await new Promise(r => setTimeout(r, skipped ? 0 : 600));
    dismissBoot();
  })();
} else if (bootDiv) {
  bootDiv.style.display = 'none';
}

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ─── BLUR-UP IMAGE LOAD ──────────────────────────────────── */
document.querySelectorAll('.photo-item img').forEach(img => {
  img.classList.add('loading');
  if (img.complete) {
    img.classList.remove('loading');
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    }, { once: true });
  }
});

/* ─── CATEGORY FILTER ─────────────────────────────────────── */
const filterButtons = document.querySelectorAll('.gallery-filter');
const photoItems    = document.querySelectorAll('.photo-item');

function applyFilter(cat) {
  photoItems.forEach(item => {
    const itemCat = item.dataset.category;
    const show    = cat === 'all' || itemCat === cat;
    item.style.display = show ? '' : 'none';
  });
  filterButtons.forEach(btn => {
    const active = btn.dataset.filter === cat;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

/* Atualiza contadores das categorias */
document.querySelectorAll('.gallery-filter').forEach(btn => {
  const cat = btn.dataset.filter;
  const count = cat === 'all'
    ? photoList.length
    : photoList.filter(p => p.category === cat).length;
  const span = btn.querySelector('.fcount');
  if (span) span.textContent = `(${count})`;
});

/* ─── LIGHTBOX ────────────────────────────────────────────── */
let currentPhotoIdx = 0;
let lastFocused     = null;
const lb     = document.getElementById('lightbox');
const lbImg  = document.getElementById('lb-img');
const lbInfo = document.getElementById('lb-info');

function openLightbox(src, info) {
  currentPhotoIdx = photoList.findIndex(p => p.src === src);
  if (currentPhotoIdx === -1) currentPhotoIdx = 0;
  lastFocused = document.activeElement;
  lbImg.src = src;
  lbImg.alt = info;
  lbImg.style.display = 'block';
  lbInfo.textContent = info;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.lb-close')?.focus();
}

function closeLightbox() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

function lbNavigate(dir) {
  currentPhotoIdx = (currentPhotoIdx + dir + photoList.length) % photoList.length;
  const p = photoList[currentPhotoIdx];
  lbImg.src = p.src;
  lbImg.alt = p.info;
  lbInfo.textContent = p.info;
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lbNavigate = lbNavigate;

lb.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (lb.classList.contains('open')) {
    if (e.key === 'ArrowRight') lbNavigate(1);
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
  }
});

/* ─── CONTACT FORM ────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = ''; // ex: 'https://formspree.io/f/abcd1234'
const CONTACT_EMAIL      = 'paiva@example.com'; // fallback mailto

async function submitForm() {
  const nameEl  = document.getElementById('input-name');
  const emailEl = document.getElementById('input-email');
  const msgEl   = document.getElementById('input-msg');
  const btn     = document.querySelector('.cli-submit');
  const st      = document.getElementById('form-status');

  const name  = nameEl.value.trim();
  const email = emailEl.value.trim();
  const msg   = msgEl.value.trim();

  st.style.color = 'var(--dim)';
  st.textContent = '';

  if (!name || !email || !msg) {
    st.style.color = '#ff5555';
    st.textContent = '// erro: campos obrigatórios não preenchidos';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    st.style.color = '#ff5555';
    st.textContent = '// erro: email inválido';
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');
  st.style.color = 'var(--accent)';
  st.textContent = '// enviando';

  try {
    if (FORMSPREE_ENDPOINT) {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg }),
      });
      if (!res.ok) throw new Error('network');
      st.textContent = '// mensagem enviada com sucesso → resposta em 24h';
      nameEl.value = emailEl.value = msgEl.value = '';
    } else {
      // Fallback: abre cliente de email do usuário
      const subject = encodeURIComponent(`Contato via portfolio — ${name}`);
      const body    = encodeURIComponent(`${msg}\n\n— ${name} <${email}>`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      st.textContent = '// abrindo cliente de email...';
    }
  } catch (err) {
    st.style.color = '#ff5555';
    st.textContent = '// falha de rede — tente novamente ou use o email direto';
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}
window.submitForm = submitForm;

/* ─── SERVICE WORKER ──────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  });
}
