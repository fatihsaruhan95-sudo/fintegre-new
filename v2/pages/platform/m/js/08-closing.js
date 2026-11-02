// Platform closing footer: newsletter is a Netlify form. Validate in the browser, post with fetch
// and confirm in place; if the request fails, fall back to a normal form POST.
(() => {
  const sec = document.querySelector('[data-section="closing"]');
  const form = sec && sec.querySelector('.cl-form');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const msg = sec.querySelector('.cl-msg');
  const say = (text, kind) => { if (!msg) return; msg.textContent = text; msg.className = 'cl-msg is-on ' + kind; };
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  form.addEventListener('submit', async (e) => {
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
    btn.disabled = true;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
    } catch (err) {
      HTMLFormElement.prototype.submit.call(form);
      return;
    }
    input.value = '';
    input.placeholder = 'Thanks, you are on the list';
    input.disabled = true;
    btn.textContent = 'Subscribed';
    say('Thank you. You are subscribed.', 'is-ok');
  });
  input.addEventListener('input', () => {
    input.classList.remove('is-bad');
    input.removeAttribute('aria-invalid');
    if (msg && msg.classList.contains('is-err')) msg.className = 'cl-msg';
  });
})();
