// Ecosystem: the fibre draw, labels and hub entrance are CSS transitions keyed off .is-in (v2.js).
// This only pauses the looping sparks and hub-glow pulse while the section is off screen.
(() => {
  const sec = document.querySelector('[data-section="ecosystem"]');
  if (!sec) return;
  new IntersectionObserver(([e]) => sec.classList.toggle('eco-live', e.isIntersecting), { threshold: 0 }).observe(sec);
})();
