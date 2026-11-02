// Insights newsletter room.
// Netlify form "newsletter": validates in the browser, posts with fetch and confirms in place (falls back to a normal POST).
(() => {
  const sec = document.querySelector('[data-section="newsletter"]');
  if (!sec) return;
  sec.querySelectorAll('form[name="newsletter"]').forEach((form) => {
    const input = form.querySelector('input[type="email"]'), btn = form.querySelector('button');
    const msg = form.parentElement.querySelector('[data-nl-msg]');
    const base = msg ? msg.innerHTML : '';
    const say = (html, kind) => { if (!msg) return; msg.innerHTML = html; msg.dataset.state = kind || ''; };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.checkValidity()) {
        input.setAttribute('aria-invalid', 'true'); say('Please enter a valid work email.', 'bad'); input.focus(); return;
      }
      if (!window.fetch) { form.submit(); return; }
      btn.disabled = true;
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then((r) => {
          if (!r.ok) throw new Error(r.status);
          input.value = ''; input.placeholder = 'You are subscribed'; input.disabled = true; btn.textContent = 'Subscribed';
          say('Thank you. You are on the list.', 'ok');
        })
        .catch(() => { btn.disabled = false; say('Something went wrong. Please try again.', 'bad'); });
    });
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); if (msg && msg.dataset.state === 'bad') say(base, ''); });
  });
})();
