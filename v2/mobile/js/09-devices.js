// Devices (mobile): the card row swipes natively (scroll-snap); this keeps the progress bar and
// labels in step with the swipe, and lets the labels jump to a card.
(() => {
  const sec = document.querySelector('[data-section="devices"]');
  if (!sec) return;
  const row = sec.querySelector('.dv-swipe');
  const cards = [...row.querySelectorAll('.dv-card')];
  const segs = [...sec.querySelectorAll('.dv-seg-on')];
  const labels = [...sec.querySelectorAll('[data-go]')];
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft; // card width + gap, in canvas px

  let current = -1;
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    // At the end of the row the last card can't reach the snap start, so treat "fully scrolled" as last.
    const k = row.scrollLeft >= max - 2 ? cards.length - 1 : Math.round(row.scrollLeft / step());
    if (k === current) return;
    current = k;
    segs.forEach((s, i) => { s.style.opacity = i === k ? '1' : '0'; });
    labels.forEach((b, i) => b.setAttribute('aria-current', String(i === k)));
  };
  let raf = 0;
  row.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });

  labels.forEach((b) => b.addEventListener('click', () => {
    const k = +b.dataset.go;
    row.scrollTo({ left: Math.min(k * step(), row.scrollWidth - row.clientWidth), behavior: 'smooth' });
  }));
  update();

  // Turn snapping on once the entrance has played (or straight away without motion).
  const snapOn = () => { row.classList.add('dv-snap'); };
  if (!document.documentElement.classList.contains('motion')) snapOn();
  else sec.addEventListener('v2:in', () => setTimeout(snapOn, 1700), { once: true });
})();
