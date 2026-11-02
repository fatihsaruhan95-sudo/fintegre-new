// Closing footer: the newsletter is a Netlify form. It validates in place, posts with fetch and shows the
// success state; without JS it falls back to a normal POST.
(() => {
  const form = document.querySelector('[data-section="closing"] .cl-form');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const msg = document.getElementById(form.querySelector('[aria-describedby]').getAttribute('aria-describedby'));
  const privacy = msg.innerHTML;
  const say = (html, cls) => { msg.innerHTML = html; msg.classList.remove('cl-err', 'cl-ok'); if (cls) msg.classList.add(cls); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true');
      input.style.borderColor = 'rgba(255,140,140,.7)';
      say('Enter a valid work email address.', 'cl-err');
      input.focus();
      return;
    }
    btn.disabled = true;
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(String(res.status));
      input.value = '';
      input.placeholder = 'Thanks, you are on the list';
      btn.textContent = 'Subscribed';
      say('Thanks. You are subscribed to Fintegre guides and program notes.', 'cl-ok');
    } catch (err) {
      btn.disabled = false;
      say('Something went wrong. Please try again.', 'cl-err');
    }
  });
  input.addEventListener('input', () => {
    input.style.borderColor = '';
    input.removeAttribute('aria-invalid');
    if (msg.classList.contains('cl-err')) say(privacy);
  });
})();
