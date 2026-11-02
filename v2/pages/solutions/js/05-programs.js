// Program comparison: the highlighted row follows the pointer / keyboard focus, and comes back to row 01 when you leave.
(() => {
  const sec = document.querySelector('[data-section="programs"]');
  if (!sec) return;
  const rows = [...sec.querySelectorAll('.f-row')];
  const set = (r) => rows.forEach((x) => x.classList.toggle('is-on', x === r));
  rows.forEach((r) => {
    r.addEventListener('pointerenter', () => set(r));
    r.addEventListener('focusin', () => set(r));
  });
  sec.querySelector('.f-card').addEventListener('pointerleave', () => set(rows[0]));
})();
