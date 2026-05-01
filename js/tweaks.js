/* Painel de tweaks: variant A/B, accent color, scanlines, cursor blink, theme */

const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS || {
  variant: 'A',
  accentColor: '#39FF14',
  scanlines: true,
  cursorBlink: true,
  theme: 'dark',
};

let tweaks = Object.assign({}, TWEAK_DEFAULTS, JSON.parse(localStorage.getItem('paiva_tweaks') || '{}'));

function setVariant(v) {
  document.body.classList.remove('var-a', 'var-b');
  document.body.classList.add('var-' + v.toLowerCase());
  document.querySelectorAll('.tp-opt').forEach(o => o.classList.toggle('active', o.dataset.v === v));
  tweaks.variant = v;
  persist();
}

function setAccent(c) {
  document.documentElement.style.setProperty('--accent', c);
  tweaks.accentColor = c;
  persist();
}

function setScanlines(on) {
  document.body.classList.toggle('scanlines-on', on);
  tweaks.scanlines = on;
  persist();
}

function setCursorBlink(on) {
  document.querySelectorAll('.blink').forEach(el => el.style.animationPlayState = on ? 'running' : 'paused');
  tweaks.cursorBlink = on;
  persist();
}

function setTheme(mode) {
  document.body.classList.toggle('theme-light', mode === 'light');
  tweaks.theme = mode;
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = mode === 'light' ? '[ DARK ]' : '[ LIGHT ]';
  persist();
}

function toggleTheme() {
  setTheme(tweaks.theme === 'light' ? 'dark' : 'light');
}

function persist() {
  localStorage.setItem('paiva_tweaks', JSON.stringify(tweaks));
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
  }
}

/* Expor handlers globais (chamados via inline handlers do tweaks panel) */
window.setVariant     = setVariant;
window.setAccent      = setAccent;
window.setScanlines   = setScanlines;
window.setCursorBlink = setCursorBlink;
window.toggleTheme    = toggleTheme;

/* Aplicar tweaks salvos */
(function applyTweaks() {
  setVariant(tweaks.variant);
  setAccent(tweaks.accentColor);
  setScanlines(tweaks.scanlines);
  setCursorBlink(tweaks.cursorBlink);
  setTheme(tweaks.theme);

  const tpColor = document.getElementById('tp-color');
  const tpScan  = document.getElementById('tp-scan');
  const tpBlink = document.getElementById('tp-blink');
  if (tpColor) tpColor.value   = tweaks.accentColor;
  if (tpScan)  tpScan.checked  = tweaks.scanlines;
  if (tpBlink) tpBlink.checked = tweaks.cursorBlink;

  document.querySelectorAll('.tp-opt').forEach(o =>
    o.classList.toggle('active', o.dataset.v === tweaks.variant)
  );
})();

/* Bridge para edit mode externo */
window.addEventListener('message', e => {
  if (e.data?.type === '__activate_edit_mode')  document.getElementById('tweaks-panel')?.classList.add('visible');
  if (e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel')?.classList.remove('visible');
});
if (window.parent && window.parent !== window) {
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
}
