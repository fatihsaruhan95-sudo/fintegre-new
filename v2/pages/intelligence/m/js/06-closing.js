// Intelligence closing footer: newsletter is a Netlify form ("newsletter"). JS posts it with fetch and confirms in place;
// without JS, or if the request fails, the form falls back to a normal POST.
(() => {
  const form = document.querySelector('[data-section="closing"] form[name="newsletter"]');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const err = document.getElementById(input.getAttribute('aria-describedby'));
  const bad = (on) => { input.classList.toggle('is-bad', on); input.setAttribute('aria-invalid', on ? 'true' : 'false'); if (err) err.hidden = !on; };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim() || !input.checkValidity()) { bad(true); input.focus(); return; }
    bad(false);
    btn.disabled = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        input.value = '';
        input.placeholder = 'Thanks, you are on the list';
        btn.textContent = 'Subscribed';
      })
      .catch(() => { HTMLFormElement.prototype.submit.call(form); });
  });
  input.addEventListener('input', () => bad(false));
})();
