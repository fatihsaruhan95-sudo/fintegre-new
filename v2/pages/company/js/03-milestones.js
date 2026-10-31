// Milestones: pointing at (or tapping / focusing) a year or its dot highlights that milestone; 2026 is the default.
(() => {
  const sec = document.querySelector('[data-section="milestones"]');
  if (!sec) return;
  const els = [...sec.querySelectorAll('[data-year]')];
  const set = (y) => els.forEach((e) => e.classList.toggle('is-hot', e.dataset.year === y));
  els.forEach((e) => {
    e.addEventListener('pointerenter', () => set(e.dataset.year));
    e.addEventListener('focus', () => set(e.dataset.year));
    e.addEventListener('click', () => set(e.dataset.year));
  });
  sec.querySelector('.cm-timeline').addEventListener('pointerleave', () => set('2026'));
})();
