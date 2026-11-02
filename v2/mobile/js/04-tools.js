// Tools (phone): the four stacked cards rise in one by one as each scrolls into view.
(() => {
  const sec = document.querySelector('[data-section="tools"]');
  if (!sec) return;
  const cards = [...sec.querySelectorAll('.t-card')];
  const io = new IntersectionObserver((entries) => {
    let n = 0;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.style.setProperty('--d', `${n++ * 120}ms`);
      e.target.classList.add('is-shown');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  cards.forEach((c) => io.observe(c));
})();
