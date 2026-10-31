// Insights library (mobile): filter chips, swipe-row pager, per-block reveal, "Show older" placeholder.
(() => {
  const sec = document.querySelector('[data-section="library"]');
  if (!sec) return;
  const chips = sec.querySelectorAll('.ml-chip');
  const items = sec.querySelectorAll('.lb-item[data-kind]');
  const count = sec.querySelector('.ml-count');
  const names = { market: ['market report', 'market reports'], benchmark: ['benchmark', 'benchmarks'], guide: ['guide', 'guides'], update: ['product update', 'product updates'] };
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    items.forEach((it) => { const on = f === 'all' || it.dataset.kind === f; it.classList.toggle('is-off', !on); if (on) n++; });
    count.textContent = f === 'all' ? '9 insights · newest first' : `${n} ${names[f][n === 1 ? 0 : 1]} · newest first`;
  }));

  const row = sec.querySelector('.ml-swipe'), dots = sec.querySelectorAll('.ml-pager i');
  row.addEventListener('scroll', () => {
    const max = row.scrollWidth - row.clientWidth;
    const i = max > 0 ? Math.round((row.scrollLeft / max) * (dots.length - 1)) : 0;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
  }, { passive: true });

  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('r-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  sec.querySelectorAll('.rv').forEach((b) => io.observe(b));

  const more = sec.querySelector('.ml-more');
  more.addEventListener('click', () => { more.textContent = 'That’s everything for now'; more.disabled = true; });
})();
