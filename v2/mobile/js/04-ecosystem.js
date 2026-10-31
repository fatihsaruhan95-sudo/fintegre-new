// Ecosystem (phone): headline and subline play on the section's .is-in (v2.js); the fibre diagram
// (labels, fibre draws, hub pop) starts once the diagram itself is on screen.
(() => {
  const sec = document.querySelector('[data-section="ecosystem"]');
  if (!sec) return;
  const map = sec.querySelector('.ecm-fibres');
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    sec.classList.add('ecm-go');
    io.disconnect();
  }, { threshold: 0.3 });
  io.observe(map);
})();
