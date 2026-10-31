// Newsletter form: no backend yet, so it validates in the browser and confirms in place.
(() => {
  const sec = document.querySelector('[data-section="newsletter"]');
  if (!sec) return;
  const form = sec.querySelector('.nl-form'), input = form.querySelector('input'), btn = form.querySelector('button'), note = sec.querySelector('.nl-note');
  const base = note.textContent;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      input.classList.add('is-bad'); note.className = 'nl-note is-bad'; note.textContent = 'Please enter a valid work email.'; input.focus(); return;
    }
    input.classList.remove('is-bad'); input.value = ''; input.placeholder = 'You are on the list'; input.disabled = true;
    btn.textContent = 'Subscribed'; btn.disabled = true;
    note.className = 'nl-note is-ok'; note.textContent = 'Thanks. The Q4 edition ships on 3 December.';
  });
  input.addEventListener('input', () => { input.classList.remove('is-bad'); note.className = 'nl-note'; note.textContent = base; });
})();
