// Closing footer newsletter (Netlify form "newsletter"): validates, posts with fetch and confirms in place.
// Without JS the form posts normally and comes back with ?subscribed=1.
(() => {
  const sec = document.querySelector('[data-section="closing"]');
  const form = sec && sec.querySelector('.cl-form');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const msg = sec.querySelector('.cl-msg');
  const say = (text, kind) => { if (!msg) return; msg.textContent = text; msg.className = 'cl-msg is-on ' + kind; };
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const done = () => {
    input.value = '';
    input.placeholder = 'Thanks, you are on the list';
    input.disabled = true;
    btn.textContent = 'Subscribed';
    btn.disabled = true;
    say('Thanks. You are subscribed.', 'is-ok');
  };
  if (new URLSearchParams(location.search).get('subscribed') === '1') done();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    const v = input.value.trim();
    if (!valid(v)) {
      input.classList.add('is-bad');
      input.setAttribute('aria-invalid', 'true');
      say(v ? 'Enter a valid work email.' : 'Enter a work email.', 'is-err');
      input.focus();
      return;
    }
    input.classList.remove('is-bad');
    input.removeAttribute('aria-invalid');
    btn.disabled = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then((r) => { if (!r.ok) throw new Error(r.status); done(); })
      .catch(() => { btn.disabled = false; say('Sending failed. Please try again.', 'is-err'); });
  });
  input.addEventListener('input', () => {
    input.classList.remove('is-bad');
    input.removeAttribute('aria-invalid');
    if (msg && msg.classList.contains('is-err')) msg.className = 'cl-msg';
  });
})();
