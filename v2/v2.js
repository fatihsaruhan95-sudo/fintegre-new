// Fintegre v2 runtime: canvas scaling, section entrance, header state and a shared scroll scheduler.
(() => {
  const root = document.documentElement;
  // Scale the 1440×900 design so one section fits the screen; spare width becomes side bleed.
  const fit = () => {
    const s = Math.min(window.innerWidth / 1440, Math.max(window.innerHeight, 560) / 900);
    root.style.setProperty('--s', String(Math.min(s, 1.6)));
  };
  fit();
  window.addEventListener('resize', fit);

  // One scroll listener for the page; section scripts register with V2.onScroll(fn).
  const tasks = [];
  let queued = false;
  const run = () => { queued = false; for (const fn of tasks) fn(); };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
  window.V2 = { onScroll(fn) { tasks.push(fn); fn(); }, scale: () => parseFloat(getComputedStyle(root).getPropertyValue('--s')) || 1 };

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('motion');

  // Sections play their entrance once, when their top passes 70% of the screen (works for sections taller
  // than the viewport too), and announce it with 'v2:in'.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting || e.target.classList.contains('is-in')) continue;
      e.target.classList.add('is-in');
      e.target.dispatchEvent(new CustomEvent('v2:in'));
      io.unobserve(e.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -30% 0px' });
  document.querySelectorAll('.v2-sec').forEach((s) => {
    if (s.dataset.section === 'hero') requestAnimationFrame(() => { s.classList.add('is-in'); s.dispatchEvent(new CustomEvent('v2:in')); });
    else io.observe(s);
  });

  // Header: hidden over the hero, shown when scrolling up; switches to the light style over light sections.
  const header = document.querySelector('.v2-header');
  const lights = [...document.querySelectorAll('.v2-sec[data-tone="light"]')];
  let lastY = scrollY;
  window.V2.onScroll(() => {
    const y = scrollY, heroH = document.querySelector('.v2-sec')?.offsetHeight || 900;
    if (y < heroH * 0.8 || y > lastY + 4) header.classList.remove('is-visible');
    else if (y < lastY - 4) header.classList.add('is-visible');
    lastY = y;
    const probe = 60;
    header.classList.toggle('on-light', lights.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
  });

  // In-page links scroll smoothly.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
  });
})();
