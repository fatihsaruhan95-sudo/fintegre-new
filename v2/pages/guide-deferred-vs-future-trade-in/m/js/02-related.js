// Related guides (mobile): pager dots follow the swipe row.
(() => {
  const sec = document.querySelector('[data-section="related"]');
  if (!sec) return;
  const row = sec.querySelector('.mr-swipe'), dots = sec.querySelectorAll('.mr-pager i');
  row.addEventListener('scroll', () => {
    const max = row.scrollWidth - row.clientWidth;
    const i = max > 0 ? Math.round((row.scrollLeft / max) * (dots.length - 1)) : 0;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
  }, { passive: true });
})();
