// Enterprise enquiry (Netlify form "enterprise-enquiry").
// Context from the originating CTA: ?type=apr|retailer|telecom|brand preselects the business type,
// ?program=<slug> preselects that one program, ?topic=integration|data fills the hidden topic field and shows a
// context line. Nothing else is preselected. The form validates in the browser, posts with fetch and shows the
// success state in place; without JS it posts normally and returns to ?sent=1, which shows the same state.
(() => {
  const sec = document.querySelector('[data-section="enquiry"]');
  const form = sec && sec.querySelector('[data-va-form]');
  if (!form) return;
  const card = sec.querySelector('.va-card');
  const status = sec.querySelector('[data-va-status]');
  const btn = form.querySelector('button[type="submit"]');
  const q = new URLSearchParams(location.search);
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const fit = () => { if (window.V2fit) window.V2fit(); };

  // Query-string context
  const type = (q.get('type') || '').toLowerCase();
  const typeInput = type && form.querySelector(`input[name="business_type"][data-type="${CSS.escape(type)}"]`);
  if (typeInput && type !== 'other') typeInput.checked = true;
  const program = (q.get('program') || '').toLowerCase();
  const progInput = program && program !== 'not-sure' && form.querySelector(`input[name="program_interest[]"][data-program="${CSS.escape(program)}"]`);
  if (progInput) progInput.checked = true;
  const topics = { integration: 'integration', data: 'data and reporting' };
  const topic = (q.get('topic') || '').toLowerCase();
  if (topics[topic]) {
    form.querySelector('[data-topic]').value = topic;
    const ctx = form.querySelector('[data-ctx]');
    ctx.textContent = 'Topic: ' + topics[topic];
    ctx.hidden = false;
  }
  const src = form.querySelector('[data-source-page]');
  try {
    if (src && document.referrer) {
      const u = new URL(document.referrer);
      if (u.origin === location.origin && !/^\/v2\/(mobile\/)?contact\/$/.test(u.pathname)) src.value = u.pathname;
      else if (u.origin !== location.origin) src.value = u.origin + u.pathname;
    }
  } catch (e) {}

  const showDone = (focus) => {
    card.classList.add('is-sent');
    form.setAttribute('aria-hidden', 'true');
    form.inert = true;
    fit();
    if (window.V2fit) window.V2fit();
    if (focus) {
      sec.querySelector('[data-va-focus]')?.focus({ preventScroll: true });
      scrollTo({ top: card.getBoundingClientRect().top + scrollY - 110 * (window.V2 ? V2.scale() : 1), behavior: 'smooth' });
    }
  };
  if (q.get('sent') === '1') {
    showDone(false);
    addEventListener('load', () => setTimeout(() => sec.scrollIntoView(), 50), { once: true });
  }

  const mark = (el, bad) => {
    const field = el.closest('.va-field');
    if (field.classList.contains('is-bad') !== bad) { field.classList.toggle('is-bad', bad); requestAnimationFrame(fit); }
    bad ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
  };
  const check = () => {
    let first = null;
    form.querySelectorAll('input[required]').forEach((el) => {
      const v = el.value.trim();
      const bad = !v || (el.type === 'email' && !emailOk(v));
      mark(el, bad);
      if (bad && !first) first = el;
    });
    return first;
  };
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.matches('input[required]') && el.closest('.va-field').classList.contains('is-bad')) {
      const v = el.value.trim();
      if (v && (el.type !== 'email' || emailOk(v))) mark(el, false);
    }
  });

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
