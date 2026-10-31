// Insights library: filter chips dim the cards that don't match; "Show older" has no archive yet.
(() => {
  const sec = document.querySelector('[data-section="library"]');
  if (!sec) return;
  const chips = sec.querySelectorAll('.lb-chip');
  const items = sec.querySelectorAll('.lb-item[data-kind]');
  const count = sec.querySelector('.lb-count');
  const names = { market: ['market report', 'market reports'], benchmark: ['benchmark', 'benchmarks'], guide: ['guide', 'guides'], update: ['product update', 'product updates'] };
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    items.forEach((it) => { const on = f === 'all' || it.dataset.kind === f; it.classList.toggle('is-off', !on); if (on) n++; });
    count.textContent = f === 'all' ? '9 insights · newest first' : `${n} ${names[f][n === 1 ? 0 : 1]} · newest first`;
  }));
  const more = sec.querySelector('.lb-more');
  more.addEventListener('click', () => { more.textContent = 'That’s everything for now'; more.disabled = true; });
})();
