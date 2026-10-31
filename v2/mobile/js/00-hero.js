// Mobile hero: live-valuation counter (€0 → €598 → €612) on arrival, and the full-screen mobile menu
// (opened by any [data-menu-open] button; closed by its close button, Escape or a tapped link).
(() => {
  const sec = document.querySelector('[data-section="hero"]');
  if (!sec) return;
  const root = document.documentElement;
  const motion = root.classList.contains('motion');

  // ---- Counter (Figma: €0 until 3.2 s, €598 at 3.35 s, €612 at 4.15 s while the bar fills) ----
  const price = sec.querySelector('[data-hero-price]');
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const tween = (from, to, delay, dur) => new Promise((res) => {
    const t0 = performance.now() + delay;
    const step = (now) => {
      const t = Math.min(Math.max((now - t0) / dur, 0), 1);
      price.textContent = '€' + Math.round(from + (to - from) * outCubic(t));
      if (t < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  let played = false;
  const play = () => {
    if (played || !motion || !price) return;
    played = true;
    price.textContent = '€0';
    tween(0, 598, 2800, 550).then(() => tween(598, 612, 650, 200));
  };
  sec.addEventListener('v2:in', play);
  if (sec.classList.contains('is-in')) play();

  // ---- Menu ----
  const menu = document.getElementById('m-menu');
  if (!menu) return;
  const openers = () => document.querySelectorAll('[data-menu-open]');
  let lastFocus = null;
  let hideTimer = 0;

  const setExpanded = (v) => openers().forEach((b) => b.setAttribute('aria-expanded', String(v)));
  const open = () => {
    if (menu.classList.contains('is-open')) return;
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    menu.hidden = false;
    menu.scrollTop = 0;
    root.classList.add('m-menu-lock');
    setExpanded(true);
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    menu.querySelector('[data-menu-close]')?.focus({ preventScroll: true });
  };
  const close = (restoreFocus = true) => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    root.classList.remove('m-menu-lock');
    setExpanded(false);
    hideTimer = setTimeout(() => { menu.hidden = true; }, motion ? 360 : 0);
    if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-open]')) { e.preventDefault(); open(); }
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-close]')) { close(); return; }
    const tog = e.target.closest('.mm-tog');
    if (tog) {
      const g = tog.closest('.mm-group');
      const on = !g.classList.contains('is-open');
      g.classList.toggle('is-open', on);
      tog.setAttribute('aria-expanded', String(on));
      return;
    }
    // A tapped link closes the menu first (unlocking scroll), then the page's own link handling runs.
    if (e.target.closest('a')) close(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) close();
    // Keep keyboard focus inside the open dialog.
    if (e.key === 'Tab' && !menu.hidden) {
      const f = [...menu.querySelectorAll('a, button')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
