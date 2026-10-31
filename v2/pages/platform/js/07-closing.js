// Platform closing footer: the newsletter form validates in the browser and confirms in place (no backend).
(() => {
  const sec = document.querySelector('[data-section="closing"]');
  const form = sec && sec.querySelector('.cl-form');
  if (!form) return;
  const input = form.querySelector('input');
  const btn = form.querySelector('button');
  const msg = sec.querySelector('.cl-msg');
  const say = (text, kind) => { if (!msg) return; msg.textContent = text; msg.className = 'cl-msg is-on ' + kind; };
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    const v = input.value.trim();
    if (!valid(v)) {
      input.classList.add('is-bad');
      input.setAttribute('aria-invalid', 'true');
      say(v ? 'Please enter a valid work email.' : 'Please enter your work email.', 'is-err');
      input.focus();
      return;
    }
    input.classList.remove('is-bad');
    input.removeAttribute('aria-invalid');
    input.value = '';
    input.placeholder = 'Thanks, you are on the list';
    input.disabled = true;
    btn.textContent = 'Subscribed';
    btn.disabled = true;
    say('Done. Watch your inbox for the next report.', 'is-ok');
  });
  input.addEventListener('input', () => {
    input.classList.remove('is-bad');
    input.removeAttribute('aria-invalid');
    if (msg && msg.classList.contains('is-err')) msg.className = 'cl-msg';
  });
})();
