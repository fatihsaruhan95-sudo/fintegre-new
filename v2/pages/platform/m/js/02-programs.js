// Platform · Programs (mobile): swipe row of seven program cards with a pager.
(function () {
  const sec = document.querySelector('[data-section="programs"]');
  if (!sec) return;
  const row = sec.querySelector('.pg-row');
  const cards = row ? [...row.querySelectorAll('.pg-card')] : [];
  const dots = [...sec.querySelectorAll('.pg-dot')];
  if (!cards.length) return;
  let cur = 0;
  function setActive(i) {
    if (i === cur) return;
    cur = i;
    dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
  }
  let raf = 0;
  row.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const x = row.scrollLeft;
      let best = 0, bd = Infinity;
      cards.forEach((c, k) => { const dd = Math.abs(c.offsetLeft - 20 - x); if (dd < bd) { bd = dd; best = k; } });
      if (x >= row.scrollWidth - row.clientWidth - 2) best = cards.length - 1;
      setActive(best);
    });
  }, { passive: true });
  dots.forEach((d, k) => d.addEventListener('click', () => row.scrollTo({ left: cards[k].offsetLeft - 20, behavior: 'smooth' })));
})();
