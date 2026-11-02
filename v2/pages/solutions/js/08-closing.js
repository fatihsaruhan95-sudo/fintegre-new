// Closing footer: the newsletter is a Netlify form. Submit with fetch and confirm in place; without JS it posts normally.
(() => {
  const form = document.querySelector('[data-section="closing"] .cl-form');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const err = form.parentElement.querySelector('.cl-err');
  const fail = (msg) => { err.textContent = msg; input.style.borderColor = 'rgba(255,140,140,.7)'; input.setAttribute('aria-invalid', 'true'); };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity()) { fail('Enter a valid work email.'); input.focus(); return; }
    err.textContent = ''; input.style.borderColor = ''; input.removeAttribute('aria-invalid');
    btn.disabled = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        input.value = '';
        input.placeholder = 'Thanks, you are on the list';
        btn.textContent = 'Subscribed';
      })
      .catch(() => { btn.disabled = false; fail('Something went wrong. Please try again.'); });
  });
  input.addEventListener('input', () => { err.textContent = ''; input.style.borderColor = ''; input.removeAttribute('aria-invalid'); });
})();
