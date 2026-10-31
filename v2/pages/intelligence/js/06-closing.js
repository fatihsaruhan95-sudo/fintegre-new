// Intelligence closing footer: the newsletter form validates in the browser and confirms in place (no backend).
(() => {
  const form = document.querySelector('[data-section="closing"] .cl-form');
  if (!form) return;
  const input = form.querySelector('input');
  const btn = form.querySelector('button');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim() || !input.checkValidity()) { input.classList.add('is-bad'); input.focus(); return; }
    input.classList.remove('is-bad');
    input.value = '';
    input.placeholder = 'Thanks, you are on the list';
    btn.textContent = 'Subscribed';
    btn.disabled = true;
  });
  input.addEventListener('input', () => input.classList.remove('is-bad'));
})();
