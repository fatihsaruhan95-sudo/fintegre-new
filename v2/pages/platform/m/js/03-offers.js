(function () {
  const sec = document.querySelector('[data-section="offers"]');
  if (!sec) return;
  const row = sec.querySelector('.pm-row');
  const cards = [...row.querySelectorAll('.pm-card')];
  const dots = [...sec.querySelectorAll('.pm-dot')];
  if (!row || !cards.length) return;
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
      const max = row.scrollWidth - row.clientWidth;
      let best = 0, bd = Infinity;
      cards.forEach((c, k) => { const dd = Math.abs(c.offsetLeft - 20 - x); if (dd < bd) { bd = dd; best = k; } });
      if (x >= max - 2) best = cards.length - 1;
      setActive(best);
    });
  }, { passive: true });
  dots.forEach((d, k) => d.addEventListener('click', () => {
    row.scrollTo({ left: cards[k].offsetLeft - 20, behavior: 'smooth' });
  }));
})();
