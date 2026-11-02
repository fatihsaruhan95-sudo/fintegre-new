// Ecosystem (phone): photo, phone node, headline and subline play on the section's .is-in (v2.js).
// The channel → Fintegre → buyers diagram and the bid card each start once they are themselves on screen.
(() => {
  const sec = document.querySelector('[data-section="ecosystem"]');
  if (!sec) return;
  const watch = (el, cls) => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      sec.classList.add(cls);
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
  };
  watch(sec.querySelector('.ecm-hub'), 'ecm-go');
  watch(sec.querySelector('.ecm-card'), 'ecm-card-go');
})();
