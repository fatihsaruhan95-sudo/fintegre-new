// Download form: no backend yet. Validates in the browser, market chips toggle, then shows a sent state.
(() => {
  const sec = document.querySelector('[data-section="download"]');
  if (!sec) return;
  const card = sec.querySelector('.dl-card'), form = sec.querySelector('.dl-form'), fine = sec.querySelector('.dl-fine');
  const fineText = fine.textContent;
  sec.querySelectorAll('.dl-chip').forEach((c) => c.addEventListener('click', () => c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'))));
  form.querySelectorAll('input').forEach((i) => i.addEventListener('input', () => { i.classList.remove('is-bad'); fine.classList.remove('is-bad-msg'); fine.textContent = fineText; }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('input')].filter((i) => !i.value.trim() || !i.checkValidity());
    form.querySelectorAll('input').forEach((i) => i.classList.toggle('is-bad', bad.includes(i)));
    if (!sec.querySelector('.dl-chip[aria-pressed="true"]')) { fine.classList.add('is-bad-msg'); fine.textContent = 'Pick at least one market.'; return; }
    if (bad.length) { fine.classList.add('is-bad-msg'); fine.textContent = bad[0].type === 'email' && bad[0].value ? 'Please enter a valid work email.' : 'Please fill in the highlighted fields.'; bad[0].focus(); return; }
    sec.querySelector('[data-dl-email]').textContent = form.email.value.trim();
    card.classList.add('is-sent');
  });
})();
