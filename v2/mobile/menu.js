// Full-screen mobile menu, shared by every mobile page: opened by any [data-menu-open] button, closed by its
// close button, Escape or a tapped link. Marks the link of the current page.
(() => {
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const menu = document.getElementById('m-menu');
  if (!menu) return;
  const openers = () => document.querySelectorAll('[data-menu-open]');
  // Highlight the current page (mobile URLs mirror the desktop ones under /v2/mobile/).
  const here = location.pathname.replace('/v2/mobile/', '/v2/').replace(/index\.html$/, '');
  menu.querySelectorAll('a[href^="/v2/"]').forEach((a) => {
    if (a.getAttribute('href') === here && here !== '/v2/') a.classList.add('is-current');
  });
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
