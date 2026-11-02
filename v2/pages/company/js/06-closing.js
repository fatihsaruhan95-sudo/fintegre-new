// Closing footer: Netlify newsletter form. Validates inline, posts with fetch and confirms in place; without JS it posts normally.
(() => {
  const form = document.querySelector('[data-section="closing"] form[name="newsletter"]');
  if (!form) return;
  const box = form.parentElement;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button[type="submit"]');
  const err = box.querySelector('.cl-err');
  const ok = box.querySelector('.cl-ok');
  const mark = (bad, msg) => {
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    input.style.borderColor = bad ? 'rgba(255,140,140,.7)' : '';
    if (msg) err.textContent = msg;
    err.hidden = !bad;
  };
  input.addEventListener('input', () => mark(false));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.checkValidity()) { mark(true, 'Enter a valid work email.'); input.focus(); return; }
    mark(false);
    btn.disabled = true;
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(String(res.status));
      input.value = '';
      btn.textContent = 'Subscribed';
      ok.textContent = 'Thanks, you are on the list.';
    } catch (_) {
      btn.disabled = false;
      mark(true, 'Something went wrong. Please try again.');
    }
  });
})();
