// Design your program: a real 4-step builder (programs → channels → markets/volume → contact) with a live
// summary card, then a confirmation once the form is sent. No backend: everything is computed in the browser.
(() => {
  const sec = document.querySelector('[data-section="builder"]');
  if (!sec) return;
  const isMobile = document.documentElement.classList.contains('m');
  const canvas = sec.querySelector('.v2-canvas');
  const $ = (s) => sec.querySelector(s);
  const $$ = (s) => [...sec.querySelectorAll(s)];

  const PROGRAMS = 7;
  const SHORT = { 'BYOD protection': 'BYOD' };
  const TRADED = { Lithuania: 15100, Latvia: 12300, Estonia: 13800, Poland: 58400, Finland: 21700, Czechia: 26900, Slovakia: 11200, Romania: 24600 };
  const MIX_BASE = { Phones: 228, 'Phones + tablets': 214, 'All devices': 196 };
  const TICKS = [500, 1000, 2500, 5000, 10000];
  const NAV_TOP = { 1: 779, 2: 807, 3: 763, 4: 723 };
  const NEXT_LABEL = { 1: 'Continue to channels  →', 2: 'Continue to markets  →', 3: 'Continue to contact  →', 4: 'Send my program  →' };

  const state = { step: 1, programs: [], channels: [], markets: [], t: 0.5, mix: 'Phones + tablets' };
  // Start from what the page shows (the Figma defaults).
  for (const g of ['programs', 'channels', 'markets']) state[g] = $$(`[data-group="${g}"].is-on`).map((b) => b.dataset.val);

  const fmt = (n) => n.toLocaleString('en-US');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const listJoin = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);

  // Volume slider: ticks are evenly spaced, values interpolate between them.
  const volume = () => {
    const seg = clamp(state.t, 0, 1) * 4, i = Math.min(3, Math.floor(seg)), f = seg - i;
    const v = TICKS[i] + (TICKS[i + 1] - TICKS[i]) * f;
    const step = v < 1000 ? 50 : v < 5000 ? 100 : 250;
    return Math.round(v / step) * step;
  };
  const volLabel = () => (state.t >= 0.999 ? '10,000+' : fmt(volume()));

  const calc = () => {
    const n = state.programs.length, c = state.channels.length, m = state.markets.length;
    const app = state.channels.includes('In your app');
    const buyers = m ? Math.round(4 + m * 2.2 + Math.log2(volume() / 500) * 1.5) : 0;
    const value = (MIX_BASE[state.mix] || 214) + Math.round((buyers - 14) * 1.5);
    const weeks = clamp(6 + Math.max(0, m - 3) + (n > 3 ? 1 : 0) + (app ? 1 : 0), 6, 12);
    const traded = state.markets.reduce((s, k) => s + (TRADED[k] || 0), 0);
    return { n, c, m, app, buyers, value, weeks, traded };
  };

  // ---------- Summary card ----------
  const card = {
    label: $('[data-b-steplabel]'), bars: $$('.b-prog i'), tags: $('[data-b-tags]'), val: $('[data-b-val]'), note: $('[data-b-note]'),
    buyRow: $('[data-b-buyrow]'), buyers: $('[data-b-buyers]'), time: $('[data-b-time]'), foot: $('[data-b-foot]'),
  };
  let shownTags = new Set();
  const setText = (el, txt) => {
    if (!el || el.textContent === txt) return;
    el.textContent = txt;
    el.classList.remove('b-flash'); void el.offsetWidth; el.classList.add('b-flash');
  };
  const renderCard = () => {
    const s = Math.min(state.step, 4), k = calc();
    card.label.textContent = s === 4 ? 'Ready to send' : `Step ${s} of 4`;
    card.bars.forEach((b, i) => { b.className = i + 1 < s ? 'done' : i + 1 === s ? 'now' : ''; });

    const tags = [
      ...state.programs.map((t) => [t, 1]),
      ...(s >= 2 ? state.channels.map((t) => [t, 2]) : []),
      ...(s >= 3 ? state.markets.map((t) => [t, 3]) : []),
      ...(s >= 3 ? [[`${volLabel()} / month`, 3]] : []),
    ];
    const max = isMobile ? 14 : 11;
    const next = new Set();
    card.tags.innerHTML = '';
    tags.slice(0, max).forEach(([t, from]) => {
      const el = document.createElement('span');
      el.textContent = t;
      if (from === s && s < 4) el.classList.add('cur');
      const key = `${from}:${t}`;
      if (shownTags.has(key) || t.endsWith('/ month')) el.classList.add('old');
      next.add(key);
      card.tags.append(el);
    });
    if (tags.length > max) { const em = document.createElement('em'); em.textContent = `+${tags.length - max} more`; card.tags.append(em); }
    if (!tags.length) { const em = document.createElement('em'); em.textContent = 'Nothing selected yet'; card.tags.append(em); }
    shownTags = next;

    let val, note, buyers, time, foot;
    if (s === 1) {
      val = k.n ? '€180–240' : '—';
      note = 'Typical range for phones in the Baltics';
      buyers = '—';
      time = k.n ? `~${clamp(5 + k.n, 6, 12)} weeks` : '—';
      foot = 'Add channels and markets to narrow the estimate.';
    } else if (s === 2) {
      val = k.c ? '€190–235' : '€180–240';
      note = 'Phones and tablets, Baltic buyers';
      buyers = k.c ? `${5 + k.c * 2} in network` : '—';
      time = `~${clamp(4 + Math.max(k.n, 1) + (k.app ? 1 : 0), 6, 12)} weeks`;
      foot = 'Add markets and volume to see live bids.';
    } else {
      val = k.m ? `€${k.value}` : '—';
      note = 'Average best bid, last 30 days';
      buyers = k.m ? `${k.buyers} competing` : '—';
      time = k.m ? `${k.weeks} weeks` : '—';
      foot = s === 4 ? 'Your summary is attached to the request.' : k.m ? `Based on ${fmt(k.traded)} devices traded in these markets last month.` : 'Pick at least one market to see live bids.';
    }
    setText(card.val, val);
    card.note.textContent = note;
    setText(card.buyers, buyers);
    card.buyRow.classList.toggle('is-muted', buyers === '—');
    setText(card.time, time);
    card.foot.textContent = foot;
  };

  // ---------- Step 1–3 inputs ----------
  const count = $('[data-b-count]');
  const hint = $('[data-b-hint]');
  const renderInputs = () => {
    if (count) count.textContent = `${state.programs.length} of ${PROGRAMS} selected`;
    $$('[data-group]').forEach((b) => {
      const on = state[b.dataset.group].includes(b.dataset.val);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-mix]').forEach((b) => { const on = b.dataset.mix === state.mix; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    const vol = $('[data-b-volnum]');
    if (vol) vol.textContent = volLabel();
    $$('.b-vol').forEach((v) => v.style.setProperty('--t', String(state.t)));
    const near = Math.round(state.t * 4);
    $$('.b-tick').forEach((t) => t.classList.toggle('is-on', Number(t.dataset.tick) === near && Math.abs(state.t * 4 - near) < 0.08));
    const r = $('[data-b-vol]');
    if (r) { r.value = String(Math.round(state.t * 1000)); r.setAttribute('aria-valuetext', `${volLabel()} devices per month`); }
  };

  sec.addEventListener('click', (e) => {
    const b = e.target.closest('[data-group]');
    if (b) {
      const g = state[b.dataset.group], v = b.dataset.val, i = g.indexOf(v);
      if (i >= 0) g.splice(i, 1); else g.push(v);
      // Keep the canonical order of the options on the page.
      const order = $$(`[data-group="${b.dataset.group}"]`).map((x) => x.dataset.val);
      g.sort((a, z) => order.indexOf(a) - order.indexOf(z));
      hint.classList.remove('is-on');
      update();
      return;
    }
    const m = e.target.closest('[data-mix]');
    if (m) { state.mix = m.dataset.mix; update(); }
  });
  const range = $('[data-b-vol]');
  if (range) range.addEventListener('input', () => { state.t = Number(range.value) / 1000; update(); });

  // ---------- Navigation ----------
  const nav = $('[data-b-nav]');
  const back = $('[data-b-back]');
  const next = $('[data-b-next]');
  const required = { 1: ['programs', 'Pick at least one program'], 2: ['channels', 'Pick at least one channel'], 3: ['markets', 'Pick at least one market'] };
  const valid = (s) => !required[s] || state[required[s][0]].length > 0;

  const renderNav = () => {
    const s = state.step;
    if (back) back.hidden = s === 1 || s === 5;
    if (count) count.hidden = s !== 1;
    if (next) {
      next.textContent = NEXT_LABEL[s] || '';
      next.setAttribute('aria-disabled', String(!valid(s)));
    }
    if (nav && !isMobile && NAV_TOP[s]) nav.style.setProperty('--nav-top', `${NAV_TOP[s]}px`);
  };

  const fitHeight = () => {
    // Phones: the section is as tall as the current step's content.
    if (!isMobile) return;
    const inner = sec.querySelector('[data-b-flow]');
    if (inner) sec.style.setProperty('--h', `${Math.ceil(inner.offsetHeight)}px`);
  };

  const heroChips = [...document.querySelectorAll('[data-section="hero"] [data-dyp-goto]')].filter((c) => c.tagName === 'BUTTON');
  const goTo = (s, opts = {}) => {
    state.step = s;
    sec.dataset.step = String(s);
    sec.classList.toggle('is-light', s === 4);
    $$('[data-for]').forEach((el) => el.classList.remove('is-cur'));
    requestAnimationFrame(() => requestAnimationFrame(() => $$('[data-for]').forEach((el) => {
      if (el.dataset.for.split(' ').includes(String(s))) el.classList.add('is-cur');
    })));
    // Inert hidden panels so keyboard focus stays in the current step.
    $$('[data-b-panel]').forEach((p) => { p.inert = p.dataset.bPanel !== String(s); });
    heroChips.forEach((c) => c.classList.toggle('is-on', Number(c.dataset.dypGoto) === Math.min(s, 4)));
    hint.classList.remove('is-on');
    update();
    fitHeight();
    if (opts.scroll !== false) {
      const top = sec.getBoundingClientRect().top + scrollY;
      if (Math.abs(sec.getBoundingClientRect().top) > 4) scrollTo({ top, behavior: 'smooth' });
    }
    if (opts.focus) {
      const h = sec.querySelector(`[data-b-panel="${s}"] h2`);
      if (h) { h.setAttribute('tabindex', '-1'); setTimeout(() => h.focus({ preventScroll: true }), 400); }
    }
  };

  const update = () => { renderInputs(); renderCard(); renderNav(); fitHeight(); };

  if (back) back.addEventListener('click', () => goTo(Math.max(1, state.step - 1), { focus: true }));
  if (next) next.addEventListener('click', () => {
    const s = state.step;
    if (s === 4) { form.requestSubmit(); return; }
    if (!valid(s)) { hint.textContent = required[s][1]; hint.classList.add('is-on'); return; }
    goTo(s + 1, { focus: true });
  });

  // ---------- Step 4 form ----------
  const form = $('[data-b-form]');
  const fieldOk = (input) => {
    const ok = input.checkValidity() && (!input.required || input.value.trim() !== '');
    input.closest('.b-field').classList.toggle('is-bad', !ok);
    return ok;
  };
  form.addEventListener('input', (e) => { if (e.target.closest('.b-field.is-bad')) fieldOk(e.target); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll('input[required]')];
    const bad = inputs.filter((i) => !fieldOk(i));
    if (bad.length) {
      hint.textContent = 'Please check the highlighted fields';
      hint.classList.add('is-on');
      bad[0].focus();
      return;
    }
    if (!valid(1) || !valid(2) || !valid(3)) { goTo([1, 2, 3].find((s) => !valid(s))); return; }
    fillConfirmation(new FormData(form));
    goTo(5, { focus: true });
  });

  // ---------- Confirmation ----------
  const fillConfirmation = (data) => {
    const k = calc();
    const id = `FP-${2000 + Math.floor(Math.random() * 7999)}`;
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const company = String(data.get('company') || '').trim();
    const put = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };
    put('[data-d-chip]', `Request sent · ${id}`);
    put('[data-d-lede]', `A program lead reviews your choices and sends a draft plan with a valuation sample for ${listJoin(state.markets)}.`);
    put('[data-d-meta]', `${id} · ${date} · ${company || 'Your company'}`);
    put('[data-d-programs]', state.programs.map((p) => SHORT[p] || p).join(', '));
    put('[data-d-channels]', state.channels.join(', '));
    put('[data-d-markets]', state.markets.join(', '));
    put('[data-d-volume]', `${volLabel()} devices / month`);
    put('[data-d-val]', `€${k.value}`);
    put('[data-d-buyers]', String(k.buyers));
    put('[data-d-time]', `${k.weeks} weeks`);
    sec._summary = { id, date, company, name: String(data.get('name') || ''), email: String(data.get('email') || ''), k };
  };

  // "Download summary (PDF)": a clean printable page; the browser's print dialog saves it as PDF.
  const pdf = $('[data-d-pdf]');
  if (pdf) pdf.addEventListener('click', () => {
    const s = sec._summary || { id: '', date: '', company: '', k: calc() };
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const rows = [['Programs', state.programs.join(', ')], ['Channels', state.channels.join(', ')], ['Markets', state.markets.join(', ')],
      ['Volume', `${volLabel()} devices / month`], ['Device mix', state.mix], ['Estimated value per device', `€${s.k.value}`],
      ['Buyers competing', s.k.buyers], ['Time to launch', `${s.k.weeks} weeks`]];
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><title>Fintegre program summary ${esc(s.id)}</title><style>body{font:15px/1.5 system-ui,sans-serif;color:#0F1115;max-width:640px;margin:48px auto;padding:0 24px}h1{font-weight:400;font-size:28px;margin:0 0 4px}p{color:#5b6372;margin:0 0 24px}td{padding:10px 0;border-bottom:1px solid #e3e7ee;vertical-align:top}td:first-child{color:#5b6372;width:45%}</style><h1>Program summary</h1><p>${esc([s.id, s.date, s.company].filter(Boolean).join(' · '))}</p><table>${rows.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table>`);
    w.document.close();
    w.focus();
    w.print();
  });

  // ---------- Entry points from the hero (step chips, CTAs) ----------
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-dyp-goto]');
    if (!g) return;
    e.preventDefault();
    e.stopPropagation();
    goTo(Number(g.dataset.dypGoto));
  }, true);

  // Mobile channel swipe row: dots follow the scroll position.
  const row = $('[data-b-swipe]');
  if (row) {
    const dots = $$('[data-b-dots] i');
    const onScroll = () => {
      const max = row.scrollWidth - row.clientWidth || 1;
      const i = clamp(Math.round((row.scrollLeft / max) * (dots.length - 1)), 0, dots.length - 1);
      dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
    };
    row.addEventListener('scroll', onScroll, { passive: true });
  }

  window.addEventListener('resize', fitHeight);
  if (document.fonts) document.fonts.ready.then(fitHeight);
  goTo(1, { scroll: false });
})();
