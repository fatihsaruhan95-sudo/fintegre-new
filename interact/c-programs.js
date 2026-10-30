// Sections 5–6: program sheet (services) and the interactive feature cards (features).
// Generic data-href scrolling lives in shell.js; the feature highlight and pinning live in site.js.
(() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activate = (el, fn) => {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); }
    });
  };
  // Radio groups: click to select, arrow keys move selection, roving tabindex.
  const radioGroup = (items, onSelect) => {
    const select = (idx, focus) => {
      items.forEach((it, i) => {
        it.setAttribute('aria-checked', String(i === idx));
        it.tabIndex = i === idx ? 0 : -1;
      });
      if (focus) items[idx].focus();
      onSelect(idx);
    };
    items.forEach((it, i) => {
      activate(it, () => select(i, false));
      it.addEventListener('keydown', (e) => {
        const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select((i + d + items.length) % items.length, true);
      });
    });
    return select;
  };

  /* ---------------- Services: program sheet ---------------- */
  const services = document.querySelector('[data-section="services"]');
  if (services) {
    const CH = ['In store', 'Online', 'In app'];
    const WHO = ['Retailers', 'Telcos', 'OEMs'];
    const P = {
      tradein: {
        title: 'Trade-in and buyback',
        summary: 'Value the customer’s old device and turn it into credit, cash or a voucher in a single visit.',
        steps: ['Identify the device by IMEI or model in seconds.', 'Run guided checks. Connected buyers compete for one live price.', 'Apply the value to the new device, or pay it out the same day.'],
        who: [1, 1, 1], ch: [1, 1, 1],
        metric: ['+18%', 'more new-device sales when trade-in is offered at checkout.'],
      },
      upgrade: {
        title: 'Early upgrade',
        summary: 'Customers move to a new device before the contract ends, and the old device’s residual value settles the rest.',
        steps: ['Check eligibility and the remaining contract balance.', 'Value the current device live, with the same checks as trade-in.', 'Residual value clears the balance. The new contract starts that day.'],
        who: [0, 1, 1], ch: [1, 1, 1],
        metric: ['4.2 months', 'earlier upgrade on average, with no extra cost to the customer.'],
      },
      deferred: {
        title: 'Deferred trade-in',
        summary: 'Sell the new device today and collect the old one later, at a value locked on the day of purchase.',
        steps: ['Lock the trade-in value at checkout and apply it as credit.', 'The customer keeps the old device for up to 30 days to move their data.', 'Hand-in in store or by courier. Checks confirm the locked value.'],
        who: [1, 1, 0], ch: [1, 1, 1],
        metric: ['92%', 'of devices handed in within the 30-day window.'],
      },
      byod: {
        title: 'BYOD protection',
        summary: 'Verify a customer’s own device in seconds and enrol it in insurance before they leave.',
        steps: ['Run a 60-second diagnostic on the device.', 'Record condition and IMEI against the new policy.', 'Enrol and issue cover on the spot, with evidence attached.'],
        who: [1, 1, 0], ch: [1, 0, 1],
        metric: ['60 s', 'average verification time per device, in store or in the app.'],
      },
      warranty: {
        title: 'Warranty extension',
        summary: 'Confirm a device’s condition at the counter and offer an extended warranty with evidence behind it.',
        steps: ['Check screen, battery and core functions.', 'Store a condition report with photos against the IMEI.', 'Offer the extension and activate it at the till.'],
        who: [1, 0, 1], ch: [1, 0, 1],
        metric: ['1 in 4', 'customers add an extended warranty when the check is shown.'],
      },
      claims: {
        title: 'Claim validation',
        summary: 'Check damage claims against objective device data before any money moves.',
        steps: ['The claim starts in store, online or in the app, with the device.', 'Diagnostics compare today’s state with the enrolment report.', 'Approve, repair or decline, with a clear reason the customer can see.'],
        who: [0, 1, 1], ch: [1, 1, 1],
        metric: ['−31%', 'fewer invalid claims paid out in the first quarter.'],
      },
      returns: {
        title: 'Return avoidance',
        summary: 'Diagnose a device at the point of return and solve the real issue instead of taking it back.',
        steps: ['Run diagnostics as soon as the return starts.', 'Guide a fix: a setting, a reset or a replacement part.', 'Accept the return only when a real fault is found.'],
        who: [1, 0, 1], ch: [1, 1, 0],
        metric: ['27%', 'of return requests resolved without a return.'],
      },
    };

    const sheet = services.querySelector('[data-c-sheet]');
    const panel = sheet.querySelector('[role="dialog"]');
    const body = sheet.querySelector('[data-c-sheet-body]');
    const eyebrow = sheet.querySelector('[data-c-sheet-eyebrow]');
    const cells = [...services.querySelectorAll('[data-c-program]')];
    const compareBtn = services.querySelector('[data-c-compare]');
    const iconOf = (key) => services.querySelector(`[data-c-program="${key}"] img`)?.getAttribute('src') || '';
    let opener = null, closeTimer = 0;

    const actions = (primaryLabel = 'See it in the estimator') => `
      <div class="c-sheet__actions">
        <span class="c-sheet__btn c-sheet__btn--primary" role="link" tabindex="0" data-href="#estimator">${primaryLabel}</span>
        <span class="c-sheet__btn c-sheet__btn--ghost" role="link" tabindex="0" data-href="#resources">Talk to a specialist</span>
      </div>`;

    const renderDetail = (key, fromCompare) => {
      const p = P[key];
      eyebrow.innerHTML = fromCompare
        ? '<button type="button" class="c-sheet__back" data-c-sheet-back>← All programs</button>'
        : 'Program';
      body.innerHTML = `
        <div class="c-sheet__icon"><img alt="" src="${iconOf(key)}"></div>
        <h2 class="c-sheet__title" id="c-sheet-title" tabindex="-1">${p.title}</h2>
        <p class="c-sheet__summary">${p.summary}</p>
        <h3 class="c-sheet__h">How it works</h3>
        <ol class="c-sheet__steps">${p.steps.map((s, i) => `<li><span aria-hidden="true">${i + 1}</span><div><span class="c-sr">Step ${i + 1}: </span>${s}</div></li>`).join('')}</ol>
        <h3 class="c-sheet__h">Best for</h3>
        <ul class="c-sheet__chips">${WHO.map((w, i) => p.who[i] ? `<li>${w}</li>` : `<li data-off aria-hidden="true">${w}</li>`).join('')}</ul>
        <div class="c-sheet__metric"><small>Example</small><b>${p.metric[0]}</b><p>${p.metric[1]}</p></div>
        ${actions()}`;
      body.scrollTop = 0;
    };

    const renderCompare = () => {
      eyebrow.textContent = 'All programs';
      const yes = '<span class="c-yes" aria-hidden="true">✓</span><span class="c-sr">Yes</span>';
      const no = '<span class="c-no" aria-hidden="true">–</span><span class="c-sr">No</span>';
      body.innerHTML = `
        <h2 class="c-sheet__title" id="c-sheet-title" tabindex="-1">Compare programs</h2>
        <p class="c-sheet__summary">Where each program runs. All of them share the same checks, pricing and payouts.</p>
        <table class="c-sheet__table">
          <thead><tr><th scope="col">Program</th>${CH.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
          <tbody>${Object.entries(P).map(([k, p]) => `<tr><th scope="row"><button type="button" class="c-sheet__row-btn" data-c-sheet-open="${k}">${p.title}</button></th>${p.ch.map((v) => `<td>${v ? yes : no}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        ${actions('Find the right program')}`;
      body.scrollTop = 0;
    };

    const setExpanded = (on) => { if (opener) opener.setAttribute('aria-expanded', String(on)); };
    const open = (view, from) => {
      clearTimeout(closeTimer);
      if (opener && opener !== from) setExpanded(false);
      opener = from;
      view();
      setExpanded(true);
      sheet.classList.add('is-open');
      document.documentElement.classList.add('no-scroll');
      requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-shown')));
      body.querySelector('#c-sheet-title').focus({ preventScroll: true });
    };
    const close = () => {
      if (!sheet.classList.contains('is-open')) return;
      sheet.classList.remove('is-shown');
      document.documentElement.classList.remove('no-scroll');
      setExpanded(false);
      opener?.focus({ preventScroll: true });
      closeTimer = setTimeout(() => sheet.classList.remove('is-open'), reduced() ? 0 : 450);
    };

    cells.forEach((c) => activate(c, () => open(() => renderDetail(c.dataset.cProgram, false), c)));
    if (compareBtn) activate(compareBtn, () => open(renderCompare, compareBtn));

    sheet.addEventListener('click', (e) => {
      if (e.target.closest('[data-c-sheet-close]')) { close(); return; }
      const row = e.target.closest('[data-c-sheet-open]');
      if (row) { renderDetail(row.dataset.cSheetOpen, true); body.querySelector('#c-sheet-title').focus({ preventScroll: true }); return; }
      if (e.target.closest('[data-c-sheet-back]')) { renderCompare(); body.querySelector('#c-sheet-title').focus({ preventScroll: true }); return; }
      // Actions: close first, then shell.js (document listener) scrolls to the data-href target.
      if (e.target.closest('[data-href]')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!sheet.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = [...panel.querySelectorAll('button, [tabindex="0"], a[href]')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------- Features ---------------- */
  const features = document.querySelector('[data-section="features"]');
  if (!features) return;

  // List items scroll their card to the viewport centre. Rects are in viewport pixels even under the body zoom.
  features.querySelectorAll('[data-c-feature-go]').forEach((item) => {
    const card = features.querySelector(`[data-feature-card="${item.dataset.featureItem}"]`);
    activate(item, () => {
      const r = card.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2, behavior: reduced() ? 'auto' : 'smooth' });
    });
    // Mirror site.js's highlight for assistive tech.
    const sync = () => item.setAttribute('aria-current', String(item.classList.contains('is-active')));
    sync();
    new MutationObserver(sync).observe(item, { attributes: true, attributeFilter: ['class'] });
  });

  // Card 1: apply the value as credit, with undo.
  const credit = features.querySelector('[data-c-credit]');
  if (credit) {
    const text = credit.querySelector('[data-c-credit-text]');
    const label = features.querySelector('[data-c-credit-label]');
    const set = (on) => {
      credit.setAttribute('aria-pressed', String(on));
      text.textContent = on ? '✓ Credit applied' : 'Apply as credit';
      label.innerHTML = on ? '€612 off the new iPhone<button type="button" class="c-undo">Undo</button>' : 'Trade-in value';
    };
    activate(credit, () => set(credit.getAttribute('aria-pressed') !== 'true'));
    label.addEventListener('click', (e) => {
      if (!e.target.closest('.c-undo')) return;
      set(false);
      credit.focus();
    });
  }

  // Card 2: channel tabs change the journey rows.
  const tabs = [...features.querySelectorAll('[data-c-tab]')];
  if (tabs.length) {
    const panel = features.querySelector('[data-c-panel]');
    const labels = [...panel.querySelectorAll('[data-c-row-label]')];
    const values = [...panel.querySelectorAll('[data-c-row-value]')];
    const note = panel.querySelector('[data-c-row-note]');
    const ROWS = {
      store: [['Device identified', 'iPhone 15 Pro'], ['Checks complete', '3 of 3'], ['Value offered', '€612'], ['Credit applied', 'New iPhone']],
      online: [['Device selected', 'iPhone 15 Pro'], ['Condition answered', '4 of 4'], ['Value locked', '€612 · 14 days'], ['Courier booked', 'Free label']],
      app: [['Device detected', 'This iPhone'], ['Self-diagnostics', '12 of 12'], ['Value offered', '€612'], ['Credit applied', 'Upgrade order']],
    };
    const NOTES = { store: 'Same steps on every channel', online: 'Same value, checked again on arrival', app: 'Same rules, run on the device itself' };
    let swapTimer = 0;
    const show = (i, focus) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      if (focus) tabs[i].focus();
      const key = tabs[i].dataset.cTab;
      const apply = () => {
        ROWS[key].forEach(([l, v], r) => { labels[r].textContent = l; values[r].textContent = v; });
        note.textContent = NOTES[key];
        panel.setAttribute('aria-labelledby', tabs[i].id || '');
        panel.classList.remove('is-swapping');
      };
      clearTimeout(swapTimer);
      if (reduced()) { apply(); return; }
      panel.classList.add('is-swapping');
      swapTimer = setTimeout(apply, 180);
    };
    tabs.forEach((t, i) => {
      t.id = t.id || `c-tab-${t.dataset.cTab}`;
      activate(t, () => show(i, false));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); show((i + d + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); show(0, true); }
        if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
      });
    });
    panel.setAttribute('aria-labelledby', tabs[0].id);
  }

  // Card 3: pick a buyer; the round closes on a live countdown and reopens.
  const buyers = [...features.querySelectorAll('[data-c-buyer]')];
  const chip = features.querySelector('[data-c-countdown]');
  if (buyers.length && chip) {
    const ICON_WIN = 'assets/features-icon-award.svg', ICON_USER = 'assets/features-icon-user.svg';
    const START = 12;
    let left = START, visible = false;
    const draw = () => {
      chip.textContent = left > 0 ? `Closes in 0:${String(left).padStart(2, '0')}` : 'Offer locked';
      chip.classList.toggle('is-low', left <= 3);
    };
    radioGroup(buyers, (idx) => {
      buyers.forEach((b, i) => { const img = b.querySelector('img'); if (img) img.src = i === idx ? ICON_WIN : ICON_USER; });
      left = START; draw();
    });
    setInterval(() => {
      if (!visible || document.hidden) return;
      left = left > -1 ? left - 1 : START; // 0 shows "Offer locked" for two ticks, then the round restarts
      draw();
    }, 1000);
    const card = chip.closest('[data-feature-card]');
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(card);
  }

  // Card 4: choose how to be paid, then confirm.
  const payouts = [...features.querySelectorAll('[data-c-payout]')];
  const confirm = features.querySelector('[data-c-confirm]');
  if (payouts.length && confirm) {
    const ctext = confirm.querySelector('[data-c-confirm-text]');
    const DONE = ['✓ Done. €612 credit on the new iPhone', '✓ Done. €598 to your card in 2 min', '✓ Done. €51 less a month for 12 months'];
    let choice = 0, doneTimer = 0;
    const reset = () => { clearTimeout(doneTimer); confirm.classList.remove('is-done'); ctext.textContent = 'Confirm and hand over'; };
    radioGroup(payouts, (idx) => { choice = idx; reset(); });
    activate(confirm, () => {
      if (confirm.classList.contains('is-done')) { reset(); return; }
      confirm.classList.add('is-done');
      ctext.textContent = DONE[choice];
      doneTimer = setTimeout(reset, 4000);
    });
  }
})();
