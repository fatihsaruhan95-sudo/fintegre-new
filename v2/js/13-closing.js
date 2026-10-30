// Closing footer: newsletter form has no backend yet, so it validates locally and confirms in place.
(() => {
  const form = document.querySelector('[data-section="closing"] .cl-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (!input.checkValidity()) { input.focus(); input.style.borderColor = 'rgba(255,140,140,.7)'; return; }
    input.style.borderColor = '';
    input.value = '';
    input.placeholder = 'Thanks, you are on the list';
    btn.textContent = 'Subscribed';
    btn.disabled = true;
  });
  form.querySelector('input').addEventListener('input', (e) => { e.target.style.borderColor = ''; });
})();
