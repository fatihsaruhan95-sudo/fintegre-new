// Mobile "Measured": the stat rows (low in a tall section) play their entrance when they reach the screen,
// keeping the Figma stagger (0.8 / 0.95 / 1.1 s → 0 / 150 / 300 ms from their own arrival).
(() => {
  const sec = document.querySelector('[data-section="measured"]');
  const stats = sec && sec.querySelector('.ms-stats');
  if (!stats) return;
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    stats.classList.add('is-in');
    io.disconnect();
  }, { rootMargin: '0px 0px -15% 0px' });
  io.observe(stats);
})();
