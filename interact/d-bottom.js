// Sections 11–14: full-bleed program chips, resources (report form, time slots, booking sheet),
// closing (newsletter, legal dialog). FAQ toggling lives in site.js; data-href scrolling in shell.js.
(() => {
  const $ = (root, sel) => root ? root.querySelector(sel) : null;
  const $$ = (root, sel) => root ? [...root.querySelectorAll(sel)] : [];
  const section = (slug) => document.querySelector(`[data-section="${slug}"]`);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Open a <dialog> modally and give focus back to the opener when it closes.
  const openDialog = (dlg, opener, focusEl) => {
    dlg.showModal();
    (focusEl || dlg.querySelector('input, button')).focus();
    dlg.addEventListener('close', () => opener && opener.focus(), { once: true });
  };
  // Clicking the backdrop (outside the box) closes a dialog.
  const closeOnBackdrop = (dlg) => dlg.addEventListener('click', (e) => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    const z = parseFloat(document.body.style.zoom) || 1;
    const x = e.clientX, y = e.clientY;
    // Rects are in zoomed space in some engines; check both to be safe.
    const inside = (k) => x >= r.left * k && x <= r.right * k && y >= r.top * k && y <= r.bottom * k;
    if (!inside(1) && !inside(z)) dlg.close();
  });

  /* 11 · Full-bleed: chips scroll to services (shell.js) and announce the chosen program. */
  $$(section('fullbleed'), '[data-program-chip]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const name = chip.textContent.trim();
      window.dispatchEvent(new CustomEvent('program:focus', { detail: { name } }));
    });
  });

  /* 12 · Resources */
  const res = section('resources');
  if (res) {
    // Report lead form.
    const card = $(res, '[data-report]');
    const form = $(res, '[data-lead-form]');
    const input = $(form, 'input[type="email"]');
    const msg = $(res, '[data-lead-msg]');
    const success = $(res, '[data-lead-success]');
    const note = msg ? msg.textContent : '';
    const setError = (text) => {
      form.classList.toggle('is-invalid', !!text);
      msg.classList.toggle('is-error', !!text);
      input.setAttribute('aria-invalid', text ? 'true' : 'false');
      msg.textContent = text || note;
    };
    if (form) {
      input.addEventListener('input', () => { if (form.classList.contains('is-invalid') && EMAIL.test(input.value.trim())) setError(''); });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) { setError('Enter your work email to get the report.'); input.focus(); return; }
        if (!EMAIL.test(v)) { setError('That email looks incomplete. Try name@company.com.'); input.focus(); return; }
        setError('');
        const btn = $(form, 'button[type="submit"]');
        btn.disabled = true;
        setTimeout(() => {
          btn.disabled = false;
          form.hidden = true;
          success.hidden = false;
          msg.innerHTML = '';
          msg.append(`Sent to ${v}. `);
          const reset = document.createElement('button');
          reset.type = 'button';
          reset.className = 'lead-reset';
          reset.textContent = 'Use a different email';
          reset.addEventListener('click', () => {
            success.hidden = true;
            form.hidden = false;
            card.classList.remove('is-sent');
            msg.textContent = note;
            input.value = '';
            input.focus();
          });
          msg.append(reset);
          card.classList.add('is-sent');
          success.focus();
        }, reduced() ? 0 : 450);
      });
    }

    // Time slots: one per upcoming working day, single select (radio group with arrow keys).
    const TIMES = ['10:00', '14:30', '11:00'];
    const days = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (days.length < TIMES.length) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
    }
    const fmt = (date, o) => date.toLocaleDateString('en-GB', o);
    const slots = days.map((day, i) => ({
      short: `${fmt(day, { weekday: 'short' })} ${TIMES[i]}`,
      date: `${fmt(day, { weekday: 'short', day: 'numeric', month: 'short' })}, ${TIMES[i]}`,
      long: `${fmt(day, { weekday: 'long', day: 'numeric', month: 'long' })}, ${TIMES[i]} CET`,
    }));
    const label = $(res, '[data-slots-label]');
    if (label) label.textContent = `Next available · ${fmt(days[0], { weekday: 'short', day: 'numeric', month: 'short' })} – ${fmt(days[days.length - 1], { weekday: 'short', day: 'numeric', month: 'short' })}`;

    const btns = $$(res, '[data-slot]');
    const ON = ['bg-[var(--color-bg-brand,#3047ec)]'], OFF = ['bg-white'];
    const TXT_ON = 'text-white', TXT_OFF = 'text-[color:var(--color-text-primary,#0f1115)]';
    let current = Math.max(0, btns.findIndex((b) => b.getAttribute('aria-checked') === 'true'));
    const select = (idx, focus) => {
      current = idx;
      btns.forEach((b, i) => {
        const on = i === idx;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
        b.classList.remove(...(on ? OFF : ON));
        b.classList.add(...(on ? ON : OFF));
        const s = b.querySelector('span');
        s.classList.remove(on ? TXT_OFF : TXT_ON);
        s.classList.add(on ? TXT_ON : TXT_OFF);
      });
      if (focus) btns[idx].focus();
    };
    btns.forEach((b, i) => {
      b.querySelector('span').textContent = slots[i].short;
      b.setAttribute('aria-label', slots[i].long);
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        select((i + step + btns.length) % btns.length, true);
      });
    });
    select(current);

    // Booking sheet.
    const dlg = $(res, '[data-book]');
    const bform = $(dlg, '[data-book-form]');
    const done = $(dlg, '[data-book-done]');
    const opener = $(res, '[data-book-open]');
    const nameIn = $(bform, 'input[name="name"]');
    const mailIn = $(bform, 'input[name="email"]');
    const fieldErr = (inp, text) => {
      inp.setAttribute('aria-invalid', text ? 'true' : 'false');
      document.getElementById(inp.getAttribute('aria-describedby')).textContent = text || '';
    };
    if (dlg && opener) {
      closeOnBackdrop(dlg);
      opener.addEventListener('click', () => {
        $(dlg, '[data-book-when]').textContent = slots[current].date;
        bform.hidden = false;
        done.hidden = true;
        openDialog(dlg, opener, nameIn.value ? $(bform, '.book__submit') : nameIn);
      });
      $$(dlg, '[data-book-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
      // "Change" closes the sheet and lands on the selected time slot.
      $(dlg, '[data-book-change]').addEventListener('click', () => setTimeout(() => btns[current].focus(), 0));
      [nameIn, mailIn].forEach((inp) => inp.addEventListener('input', () => { if (inp.getAttribute('aria-invalid') === 'true') fieldErr(inp, ''); }));
      bform.addEventListener('submit', (e) => {
        e.preventDefault();
        const n = nameIn.value.trim(), m = mailIn.value.trim();
        fieldErr(nameIn, n ? '' : 'Tell us your name.');
        fieldErr(mailIn, !m ? 'Enter your work email.' : EMAIL.test(m) ? '' : 'That email looks incomplete. Try name@company.com.');
        const bad = [nameIn, mailIn].find((i) => i.getAttribute('aria-invalid') === 'true');
        if (bad) { bad.focus(); return; }
        const submit = $(bform, '.book__submit');
        submit.disabled = true;
        submit.textContent = 'Booking…';
        setTimeout(() => {
          submit.disabled = false;
          submit.textContent = 'Confirm booking';
          $(dlg, '[data-book-msg]').textContent = `You're booked: ${slots[current].short}, 20 minutes. A calendar invite is on its way.`;
          bform.hidden = true;
          done.hidden = false;
          done.focus();
        }, reduced() ? 0 : 500);
      });
    }
  }

  /* 14 · Closing */
  const closing = section('closing');
  if (closing) {
    // Newsletter.
    const form = $(closing, '[data-news-form]');
    const input = $(form, 'input[type="email"]');
    const msg = $(closing, '[data-news-msg]');
    const success = $(closing, '[data-news-success]');
    const setError = (text) => {
      form.classList.toggle('is-invalid', !!text);
      input.setAttribute('aria-invalid', text ? 'true' : 'false');
      msg.textContent = text || '';
      msg.hidden = !text;
    };
    if (form) {
      input.addEventListener('input', () => { if (form.classList.contains('is-invalid') && EMAIL.test(input.value.trim())) setError(''); });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) { setError('Enter your work email to subscribe.'); input.focus(); return; }
        if (!EMAIL.test(v)) { setError('That email looks incomplete. Try name@company.com.'); input.focus(); return; }
        setError('');
        form.hidden = true;
        success.hidden = false;
        success.focus();
      });
    }

    // Legal dialog (placeholder copy).
    const LEGAL = {
      privacy: ['Privacy', [
        'This is placeholder text. The final privacy policy will be published before launch.',
        'Fintegre processes the contact details you share with us, such as your name and work email, to reply to you and send what you asked for. We do not sell personal data.',
        'Questions about your data: privacy@fintegre.com.',
      ]],
      cookies: ['Cookies', [
        'This is placeholder text. The final cookie policy will be published before launch.',
        'This site uses only the cookies it needs to work. Analytics or marketing cookies would be used only with your consent, and you can change your choice at any time.',
      ]],
      imprint: ['Imprint', [
        'This is placeholder text. The final company details will be published before launch.',
        'Fintegre. Registered office, company number and VAT number to follow.',
        'Contact: sales@fintegre.com.',
      ]],
    };
    const dlg = $(closing, '[data-legal-dialog]');
    if (dlg) {
      closeOnBackdrop(dlg);
      $$(dlg, '[data-legal-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
      $$(closing, '[data-legal]').forEach((b) => b.addEventListener('click', () => {
        const [title, paras] = LEGAL[b.dataset.legal];
        $(dlg, '[data-legal-title]').textContent = title;
        const body = $(dlg, '[data-legal-body]');
        body.replaceChildren(...paras.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
        openDialog(dlg, b, $(dlg, '.legal__close'));
      }));
    }
  }
})();
