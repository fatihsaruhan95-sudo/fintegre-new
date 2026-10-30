// Page-wide interactions: section anchors, header dropdowns, mobile menu, tour dialog.
(() => {
  // Every section is addressable as #<slug>.
  document.querySelectorAll('.page > section[data-section]').forEach((s) => { if (!s.id) s.id = s.dataset.section; });

  // In-page links scroll smoothly; the zoomed canvas needs the target's real offset.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : document.body;
    if (!target) return;
    e.preventDefault();
    closeMenus();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  });

  // Blocks marked data-href behave like links (click and Enter/Space).
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-href]');
    if (!el || e.target.closest('a, button, input')) return;
    const target = document.querySelector(el.dataset.href);
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-href], [data-menu-open], [data-tour-open]')) {
      e.preventDefault();
      e.target.click();
    }
  });

  // Header dropdowns (Platform, Solutions): click or hover to open, Escape or outside click to close.
  const drops = [...document.querySelectorAll('.nav-drop')];
  const setDrop = (d, on) => {
    d.classList.toggle('is-open', on);
    d.querySelector('button').setAttribute('aria-expanded', String(on));
  };
  drops.forEach((d) => {
    const btn = d.querySelector('button');
    btn.addEventListener('click', () => {
      const on = !d.classList.contains('is-open');
      drops.forEach((o) => setDrop(o, false));
      setDrop(d, on);
    });
    d.addEventListener('mouseenter', () => { drops.forEach((o) => setDrop(o, o === d)); });
    d.addEventListener('mouseleave', () => setDrop(d, false));
  });

  // Droplet menu: a bead drops from the header pill and stretches into the menu pill.
  const menu = document.getElementById('drop-menu');
  const dropContent = menu.querySelector('.drop-menu__drop');
  let menuTimer = 0;
  let settleTimer = 0;
  const setMenu = (on, viaKeyboard = false) => {
    clearTimeout(menuTimer);
    clearTimeout(settleTimer);
    if (on) {
      menu.hidden = false;
      // Size the blob to the content box before it stretches (the content is laid out while hidden by opacity).
      const r = { width: dropContent.offsetWidth, height: dropContent.offsetHeight }; // layout px, unaffected by the page zoom
      menu.style.setProperty('--drop-w', `${r.width}px`);
      menu.style.setProperty('--drop-h', `${r.height}px`);
      document.documentElement.classList.add('no-scroll', 'menu-open');
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      settleTimer = setTimeout(() => menu.classList.add('is-settled'), 680);
      // Move focus into the menu only for keyboard users; a mouse click shouldn't leave a focus ring on ×.
      if (viaKeyboard) menu.querySelector('.drop-menu__close').focus({ preventScroll: true });
    } else if (!menu.hidden) {
      menu.classList.remove('is-settled', 'is-open');
      document.documentElement.classList.remove('no-scroll');
      menuTimer = setTimeout(() => {
        menu.hidden = true;
        document.documentElement.classList.remove('menu-open');
      }, 520);
    }
  };
  document.addEventListener('click', (e) => { if (e.target.closest('[data-menu-open]')) setMenu(true, e.detail === 0); });
  menu.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => {
    if (menu.hidden) return;
    menu.style.setProperty('--drop-w', `${dropContent.offsetWidth}px`);
    menu.style.setProperty('--drop-h', `${dropContent.offsetHeight}px`);
  });

  // Tour dialog: a 2-minute walkthrough with chapters; playback is simulated with a progress bar.
  const tour = document.getElementById('tour');
  const bar = tour.querySelector('.tour__progress i');
  const chapters = [...tour.querySelectorAll('[data-at]')];
  let raf = 0, started = 0;
  const DURATION = 120000;
  const render = (p) => {
    bar.style.width = `${p * 100}%`;
    chapters.forEach((c, i) => {
      const next = chapters[i + 1];
      c.classList.toggle('is-current', p >= +c.dataset.at && (!next || p < +next.dataset.at));
    });
  };
  const play = (from = 0) => {
    cancelAnimationFrame(raf);
    tour.classList.add('is-playing');
    started = performance.now() - from * DURATION;
    const tick = (now) => {
      const p = Math.min((now - started) / DURATION, 1);
      render(p);
      if (p < 1) raf = requestAnimationFrame(tick); else tour.classList.remove('is-playing');
    };
    raf = requestAnimationFrame(tick);
  };
  const setTour = (on) => {
    tour.hidden = !on;
    document.documentElement.classList.toggle('no-scroll', on);
    if (!on) { cancelAnimationFrame(raf); tour.classList.remove('is-playing'); render(0); }
  };
  tour.querySelector('[data-tour-play]').addEventListener('click', () => play(0));
  chapters.forEach((c) => c.addEventListener('click', () => play(+c.dataset.at)));
  tour.querySelectorAll('[data-tour-close]').forEach((b) => b.addEventListener('click', () => setTour(false)));
  // Any element marked data-tour-open (or a link/button whose text mentions the tour) opens it.
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tour-open], a, button');
    if (!t || tour.contains(t)) return;
    if (t.hasAttribute('data-tour-open') || /2-min tour/i.test(t.textContent)) { e.preventDefault(); setTour(true); }
  });

  function closeMenus() { drops.forEach((d) => setDrop(d, false)); setMenu(false); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenus(); setTour(false); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav-drop')) drops.forEach((d) => setDrop(d, false)); });
})();
