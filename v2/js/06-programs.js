// Programs carousel, driven by vertical scroll: the section is pinned while scrolling walks the track
// card by card (with a short hold on each), so visitors see every program before moving on.
// Arrows and pager dots scroll the page to the matching card.
(() => {
  const sec = document.querySelector('[data-section="programs"]');
  if (!sec) return;
  const scroller = sec.querySelector('.pg-scroller');
  const items = [...sec.querySelectorAll('.pg-item')];
  const dots = [...sec.querySelectorAll('.pg-dot')];
  const prev = sec.querySelector('.pg-arrow[data-dir="-1"]');
  const next = sec.querySelector('.pg-arrow[data-dir="1"]');
  const STEP = 424; // card 400 + gap 24, in canvas px
  const last = items.length - 1;
  const smooth = (x) => x * x * (3 - 2 * x);
  // Linear progress through the steps, with a hold around each card.
  const HOLD = 0.22;
  const shape = (f) => {
    const i = Math.floor(f), frac = f - i;
    const m = Math.min(Math.max((frac - HOLD) / (1 - 2 * HOLD), 0), 1);
    return Math.min(i + smooth(m), last);
  };

  let index = -1;
  const paint = (i) => {
    if (i === index) return;
    index = i;
    dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', String(k === i)); });
    prev.disabled = i === 0;
    next.disabled = i === last;
  };

  const travel = () => sec.offsetHeight - innerHeight;
  const progress = () => Math.min(Math.max(-sec.getBoundingClientRect().top / Math.max(travel(), 1), 0), 1);

  V2.onScroll(() => {
    const r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const f = shape(progress() * last);
    const max = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = Math.min(f * STEP, max);
    paint(Math.round(f));
  });

  // Scroll the page so the carousel lands on card i (centre of its hold).
  const goTo = (i) => {
    const k = Math.max(0, Math.min(last, i));
    const y = sec.getBoundingClientRect().top + scrollY + (k / last) * travel();
    scrollTo({ top: y, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => goTo(k)));
  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });

  // The section is taller than the screen, so it announces its own entrance.
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting || sec.classList.contains('is-in')) return;
    sec.classList.add('is-in');
    sec.dispatchEvent(new CustomEvent('v2:in'));
    io.disconnect();
  }, { rootMargin: '0px 0px -30% 0px' }).observe(sec);

  paint(0);
})();
