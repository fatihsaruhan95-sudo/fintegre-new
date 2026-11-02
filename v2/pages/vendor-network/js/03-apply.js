// Vendor application (Netlify form "vendor-application"): validates in the browser, posts with fetch and shows
// the success state in place. Without JS the form posts normally and returns to ?sent=1, which shows the same state.
(() => {
  const sec = document.querySelector('[data-section="apply"]');
  const form = sec && sec.querySelector('[data-va-form]');
  if (!form) return;
  const card = sec.querySelector('[data-va-card]');
  const status = sec.querySelector('[data-va-status]');
  const btn = form.querySelector('button[type="submit"]');
  const group = form.querySelector('[data-va-group]');
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  // Where the visitor came from (path only).
  const src = form.querySelector('[data-source-page]');
  try {
    if (src && document.referrer) {
      const u = new URL(document.referrer);
      if (u.origin !== location.origin) src.value = u.origin + u.pathname;
      else if (!/^\/v2\/(mobile\/)?vendor-network\/$/.test(u.pathname)) src.value = u.pathname;
    }
  } catch (e) {}

  const showDone = (focus) => {
    card.classList.add('is-sent');
    form.setAttribute('aria-hidden', 'true');
    form.inert = true;
    if (window.V2fit) window.V2fit();
    if (focus) {
      sec.querySelector('[data-va-focus]')?.focus({ preventScroll: true });
      scrollTo({ top: card.getBoundingClientRect().top + scrollY - 110 * (window.V2 ? V2.scale() : 1), behavior: 'smooth' });
    }
  };
  if (new URLSearchParams(location.search).get('sent') === '1') {
    showDone(false);
    addEventListener('load', () => setTimeout(() => sec.scrollIntoView(), 50), { once: true });
  }

  const mark = (el, bad) => {
    const field = el.closest('.va-field');
    if (field.classList.contains('is-bad') !== bad) { field.classList.toggle('is-bad', bad); if (window.V2fit) requestAnimationFrame(window.V2fit); }
    if (el.matches('input, textarea')) bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
  };
  const check = () => {
    let first = null;
    form.querySelectorAll('input[required], textarea[required]').forEach((el) => {
      const v = el.value.trim();
      const bad = !v || (el.type === 'email' && !emailOk(v));
      mark(el, bad);
      if (bad && !first) first = el;
    });
    const anyCat = group.querySelector('input:checked');
    mark(group, !anyCat);
    if (!anyCat && !first) first = group.querySelector('input');
    if (window.V2fit) window.V2fit();
    return first;
  };

  form.addEventListener('input', (e) => {
    const f = e.target.closest('.va-field');
    if (f && f.classList.contains('is-bad')) {
      if (f === group) { if (group.querySelector('input:checked')) mark(group, false); }
      else { const v = e.target.value.trim(); if (v && (e.target.type !== 'email' || emailOk(v))) mark(e.target, false); }
    }
  });
  form.addEventListener('change', (e) => { if (e.target.closest('[data-va-group]') && group.querySelector('input:checked')) mark(group, false); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = check();
    if (first) {
      status.textContent = 'Please complete the highlighted fields.';
      first.focus();
      return;
    }
    status.textContent = '';
    btn.disabled = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      .then((r) => { if (!r.ok) throw new Error(r.status); showDone(true); })
      .catch(() => { btn.disabled = false; status.textContent = 'Sending failed. Please try again.'; });
  });
})();
