// Program fit matrix: the highlighted row follows the pointer / keyboard focus, and comes back to row 01 when you leave.
(() => {
  const sec = document.querySelector('[data-section="program-fit"]');
  if (!sec) return;
  const rows = [...sec.querySelectorAll('.f-row')];
  const set = (r) => rows.forEach((x) => x.classList.toggle('is-on', x === r));
  rows.forEach((r) => {
    r.addEventListener('pointerenter', () => set(r));
    r.addEventListener('focus', () => set(r));
  });
  sec.querySelector('.f-card').addEventListener('pointerleave', () => set(rows[0]));
})();
