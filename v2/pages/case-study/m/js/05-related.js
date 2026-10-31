// Mobile related cases: swipe row (native scroll-snap) with a pager that follows and drives it.
(() => {
  const sec = document.querySelector('[data-section="related"]');
  if (!sec) return;
  const track = sec.querySelector('.mre-track');
  const cards = [...track.querySelectorAll('.mre-card')];
  const dots = [...sec.querySelectorAll('.mre-pager button')];
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const i = track.scrollLeft >= max - 4 ? cards.length - 1 : Math.round(track.scrollLeft / step());
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  };
  let raf = 0;
  track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
  dots.forEach((d, k) => d.addEventListener('click', () => track.scrollTo({ left: k * step(), behavior: 'smooth' })));
})();
