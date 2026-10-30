// Tools: the left column stays pinned while the four cards scroll past; the feature list follows
// the card in view, and clicking an item scrolls to its card. Cards rise in as they enter.
(() => {
  const sec = document.querySelector('[data-section="tools"]');
  if (!sec) return;
  const pin = sec.querySelector('.t-pin');
  const items = [...sec.querySelectorAll('.t-item')];
  const cards = [...sec.querySelectorAll('.t-card')];
  const MAX = 2100, CARD_H = 640;
  const tops = cards.map((c) => parseFloat(c.style.top));

  // The section is taller than the viewport can hold at v2.js's 30% threshold, so mark it in here too.
  const enter = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || sec.classList.contains('is-in')) return;
    sec.classList.add('is-in');
    sec.dispatchEvent(new CustomEvent('v2:in'));
    enter.disconnect();
  }, { threshold: 0.08 });
  enter.observe(sec);

  const cardIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-shown'); cardIO.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px' });
  cards.forEach((c) => cardIO.observe(c));

  let active = 0, lastShift = -1;
  V2.onScroll(() => {
    const s = V2.scale();
    const r = sec.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    // Canvas y currently at the top of the viewport.
    const shift = Math.round(Math.min(Math.max(-r.top / s, 0), MAX));
    if (shift !== lastShift) { pin.style.transform = `translate3d(0, ${shift}px, 0)`; lastShift = shift; }
    const mid = (innerHeight / 2 - r.top) / s;
    let idx = 0;
    tops.forEach((t, i) => { if (mid >= t - 30) idx = i; });
    if (idx !== active) {
      items[active].classList.remove('is-on');
      items[idx].classList.add('is-on');
      active = idx;
    }
  });

  items.forEach((btn, i) => btn.addEventListener('click', () => {
    const s = V2.scale();
    const y = sec.getBoundingClientRect().top + scrollY + (tops[i] + CARD_H / 2) * s - innerHeight / 2;
    scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }));
})();
