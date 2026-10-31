// Programs (mobile): a native swipe row (scroll-snap). The pager follows the swipe; tapping a dot scrolls to that card.
(() => {
  const sec = document.querySelector('[data-section="programs"]');
  if (!sec) return;
  const scroller = sec.querySelector('.pg-scroller');
  const items = [...sec.querySelectorAll('.pg-slot')];
  const dots = [...sec.querySelectorAll('.pg-dot')];
  const STEP = 334; // card 320 + gap 14, in canvas px

  let index = -1;
  const paint = (i) => {
    if (i === index) return;
    index = i;
    dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', String(k === i)); });
  };
  // scrollLeft is in canvas px (the transform scale does not change layout units).
  const current = () => {
    if (scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 2) return items.length - 1;
    return Math.max(0, Math.min(items.length - 1, Math.round(scroller.scrollLeft / STEP)));
  };
  let raf = 0;
  scroller.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; paint(current()); });
  }, { passive: true });

  const goTo = (i) => {
    const k = Math.max(0, Math.min(items.length - 1, i));
    scroller.scrollTo({ left: items[k].offsetLeft - 20, behavior: 'smooth' });
  };
  dots.forEach((d, k) => d.addEventListener('click', () => goTo(k)));
  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });
  paint(0);
})();
