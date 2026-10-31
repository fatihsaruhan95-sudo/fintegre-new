// Platform · Flow (mobile): each of the five steps plays its own Figma entrance
// (node pop → spine/branch draw → label → card) when its label scrolls into view.
(() => {
  const sec = document.querySelector('[data-section="flow"]');
  if (!sec) return;
  const steps = [...sec.querySelectorAll('.fm-step')];
  if (!('IntersectionObserver' in window)) { steps.forEach((s) => s.classList.add('on')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.closest('.fm-step').classList.add('on');
      io.unobserve(e.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
  steps.forEach((s) => io.observe(s.querySelector('.pf-label')));
})();
