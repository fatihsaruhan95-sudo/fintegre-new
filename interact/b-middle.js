// Sections 7–10: Intelligence chart accordion, estimator form, in-store steps, device tiles.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (root, sel) => root.querySelector(sel);
  const $$ = (root, sel) => [...root.querySelectorAll(sel)];
  const sectionOf = (slug) => document.querySelector(`section[data-section="${slug}"]`);

  // Runs `fn` every `ms` while the section is on screen, until stop() is called (first user interaction).
  const autoAdvance = (section, ms, fn) => {
    if (reduced) return () => {};
    let visible = false, stopped = false, timer = 0;
    const arm = () => { clearInterval(timer); if (visible && !stopped) timer = setInterval(fn, ms); };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; arm(); }, { threshold: 0.35 }).observe(section);
    return () => { stopped = true; clearInterval(timer); };
  };

  // ---------------------------------------------------------------- Intelligence
  (() => {
    const s = sectionOf('intelligence');
    if (!s) return;
    const items = $$(s, '[data-ix-item]');
    const chart = $(s, '#ix-chart');
    const svg = $(s, '[data-ix-plot]');
    const title = $(s, '[data-ix-title]');
    const series = $$(s, '[data-ix-series]');
    const fades = $$(s, '[data-ix-fade]');
    const COLORS = ['#a496ff', '#ffb648', '#ff7e5f'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const SHOW = [0, 2, 4, 6, 9];
    const eur = (v) => `€${v}`, pct = (v) => `${v}%`;
    const TOPICS = [
      { title: 'Residual value, iPhone 15 Pro, 256 GB', ticks: [500, 560, 620, 680], fmt: eur,
        names: ['Lithuania', 'Romania', 'UAE'],
        data: [[612, 604, 598, 590, 586, 580, 571, 566, 560, 552], [574, 570, 561, 556, 548, 544, 536, 531, 522, 517], [655, 650, 646, 636, 633, 625, 619, 614, 607, 601]] },
      { title: 'Average offer by buyer, iPhone 14, 128 GB', ticks: [340, 370, 400, 430], fmt: eur,
        names: ['Buyer A', 'Buyer B', 'Buyer C'],
        data: [[402, 398, 395, 391, 388, 384, 380, 377, 372, 368], [415, 413, 410, 408, 405, 403, 401, 398, 396, 393], [385, 381, 376, 372, 366, 362, 357, 353, 348, 344]] },
      { title: 'Trade-in rate by channel, all devices', ticks: [20, 30, 40, 50], fmt: pct,
        names: ['In store', 'Online', 'App'],
        data: [[38, 39, 41, 42, 42, 44, 45, 46, 47, 48], [24, 25, 25, 27, 28, 29, 30, 31, 33, 34], [29, 30, 32, 33, 35, 36, 37, 39, 40, 42]] },
      { title: 'Devices re-graded after inspection, by market', ticks: [0, 4, 8, 12], fmt: pct,
        names: ['Lithuania', 'Romania', 'UAE'],
        data: [[6.2, 5.8, 5.4, 5.1, 4.6, 4.2, 3.9, 3.5, 3.2, 2.9], [9.4, 9, 8.3, 7.9, 7.2, 6.8, 6.1, 5.7, 5.2, 4.8], [11.2, 10.6, 10.1, 9.3, 8.8, 8, 7.6, 7, 6.5, 6.1]] },
    ];
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      parent?.appendChild(n);
      return n;
    };
    const compact = matchMedia('(max-width: 767px)');
    // Desktop keeps the design's plot inside the 570×513 card; on phones the SVG is a fluid block whose
    // viewBox matches its real width, so labels stay at true 12px size.
    const geometry = () => {
      if (!compact.matches) return { w: 570, h: 513, x0: 75.05, x1: 531.05, yTop: 141.55, yBot: 436.05, yLabelX: 33.25, xLabelY: 458, font: 12.35 };
      const w = Math.max(240, Math.round(svg.getBoundingClientRect().width || 320));
      const h = Math.round(Math.min(260, Math.max(190, w * 0.66)));
      return { w, h, x0: 44, x1: w - 8, yTop: 8, yBot: h - 28, yLabelX: 0, xLabelY: h - 8, font: 12 };
    };

    let current = 0, drawn = false;
    const render = (animate) => {
      const t = TOPICS[current];
      const g = geometry();
      svg.setAttribute('viewBox', `0 0 ${g.w} ${g.h}`);
      if (compact.matches) svg.style.aspectRatio = `${g.w} / ${g.h}`; else svg.style.aspectRatio = '';
      svg.setAttribute('aria-label', `${t.title}, example data. ${t.names.map((n, i) => `${n}: ${t.fmt(t.data[i][0])} in Jan to ${t.fmt(t.data[i][9])} in Oct`).join('; ')}.`);
      svg.textContent = '';
      const lo = t.ticks[0], hi = t.ticks[t.ticks.length - 1];
      const X = (i) => g.x0 + (g.x1 - g.x0) * i / (MONTHS.length - 1);
      const Y = (v) => g.yBot - (g.yBot - g.yTop) * (v - lo) / (hi - lo);
      const textAttrs = { fill: 'rgba(255,255,255,0.68)', 'font-family': 'Geologica, sans-serif', 'font-size': g.font };
      t.ticks.forEach((v) => {
        el('line', { class: 'ix-grid', x1: g.x0, x2: g.x1, y1: Y(v), y2: Y(v), stroke: 'white', 'stroke-opacity': 0.121569, 'stroke-width': 0.95 }, svg);
        el('text', { ...textAttrs, class: 'ix-label', x: g.yLabelX, y: Y(v), 'dominant-baseline': 'central' }, svg).textContent = t.fmt(v);
      });
      SHOW.forEach((i) => {
        el('text', { ...textAttrs, class: 'ix-label', x: X(i), y: g.xLabelY, 'text-anchor': i === MONTHS.length - 1 && compact.matches ? 'end' : 'middle', 'dominant-baseline': 'central' }, svg).textContent = MONTHS[i];
      });
      const lines = [], ends = [];
      t.data.forEach((row, k) => {
        const d = row.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join('');
        lines.push(el('path', { class: 'ix-line', d, fill: 'none', stroke: COLORS[k], 'stroke-width': 2.85, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg));
        ends.push(el('circle', { class: 'ix-end', cx: X(9), cy: Y(row[9]), r: 3.8, fill: COLORS[k], stroke: '#0C1230', 'stroke-width': 1.9 }, svg));
      });
      if (!animate || reduced) return;
      lines.forEach((p, k) => {
        const len = p.getTotalLength();
        p.style.transition = 'none';
        p.style.strokeDasharray = `${len} ${len}`;
        p.style.strokeDashoffset = len;
        p.style.transitionDelay = `${k * 0.14}s`;
        ends[k].style.opacity = 0;
        ends[k].style.transitionDelay = `${1 + k * 0.14}s`;
      });
      svg.getBoundingClientRect();
      requestAnimationFrame(() => {
        lines.forEach((p) => { p.style.transition = ''; p.style.strokeDashoffset = 0; });
        ends.forEach((c) => { c.style.opacity = 1; });
      });
    };

    const select = (i, animate = true) => {
      if (i === current && drawn) return;
      current = i;
      items.forEach((b, k) => {
        b.setAttribute('aria-expanded', String(k === i));
        $(b, '.ix-icon').dataset.name = k === i ? 'Icon / subtract' : 'Icon / add';
      });
      const swap = () => {
        title.textContent = TOPICS[i].title;
        series.forEach((p, k) => { p.textContent = TOPICS[i].names[k]; });
      };
      if (reduced || !drawn) { swap(); render(animate && drawn); }
      else {
        fades.forEach((f) => f.classList.add('is-out'));
        setTimeout(() => { swap(); fades.forEach((f) => f.classList.remove('is-out')); }, 200);
        render(true);
      }
      drawn = true;
    };

    // First draw: static now, animated line draw when the section scrolls in.
    render(false);
    drawn = true;
    if (!reduced) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setTimeout(() => render(true), 500);
      }, { threshold: 0.3 });
      io.observe(chart);
    }

    const stop = autoAdvance(s, 7000, () => select((current + 1) % items.length));
    items.forEach((b, i) => b.addEventListener('click', () => { stop(); select(i); }));

    // Redraw when the plot changes size or crosses the phone breakpoint (no animation).
    let lastW = 0;
    new ResizeObserver(() => {
      const w = Math.round(svg.getBoundingClientRect().width);
      if (w !== lastW) { lastW = w; render(false); }
    }).observe(chart);
  })();

  // ---------------------------------------------------------------- Estimator
  (() => {
    const s = sectionOf('estimator');
    if (!s) return;
    const form = $(s, '[data-est-form]');
    const email = $(s, '#estimator-email');
    const error = $(s, '[data-est-error]');
    const done = $(s, '[data-est-done]');
    const fields = [...form.children].filter((c) => c !== done);
    const ON = ['bg-[#0f1115]', 'gap-[8px]'];
    const OFF = ['bg-white', 'border', 'border-[rgba(15,17,21,0.1)]', 'border-solid'];
    const CHECK = '<span class="relative shrink-0 size-[14px]" data-name="Icon / check"><img alt="" class="absolute block inset-0 max-w-none size-full" src="assets/estimator-icon-check.svg"></span>';

    const setChip = (b, on) => {
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      b.classList.remove(...(on ? OFF : ON));
      b.classList.add(...(on ? ON : OFF));
      const label = b.querySelector('span:last-child');
      label.classList.toggle('text-white', on);
      label.classList.toggle('text-[#0f1115]', !on);
      const icon = b.querySelector('[data-name="Icon / check"]');
      if (on && !icon) b.insertAdjacentHTML('afterbegin', CHECK);
      if (!on && icon) icon.remove();
    };
    const groups = $$(s, '[data-est-group]');
    groups.forEach((g) => {
      const chips = $$(g, '[role="radio"]');
      chips.forEach((c) => { c.tabIndex = c.getAttribute('aria-checked') === 'true' ? 0 : -1; });
      const pick = (c) => chips.forEach((o) => setChip(o, o === c));
      chips.forEach((c, i) => {
        c.addEventListener('click', () => pick(c));
        c.addEventListener('keydown', (e) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          const next = chips[(i + step + chips.length) % chips.length];
          pick(next);
          next.focus();
        });
      });
    });
    const chosen = (name) => $(s, `[data-est-group="${name}"] [aria-checked="true"]`)?.textContent.trim() || '';

    const valid = () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const showError = (on) => {
      error.hidden = !on;
      email.setAttribute('aria-invalid', String(on));
    };
    let touched = false;
    email.addEventListener('blur', () => { if (email.value.trim()) { touched = true; showError(!valid()); } });
    email.addEventListener('input', () => { if (touched || !error.hidden) showError(!valid()); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      touched = true;
      if (!valid()) { showError(true); email.focus(); return; }
      showError(false);
      $(done, '[data-est-sum="role"]').textContent = chosen('role');
      $(done, '[data-est-sum="volume"]').textContent = chosen('volume');
      $(done, '[data-est-sum="email"]').textContent = email.value.trim();
      form.style.minHeight = `${form.offsetHeight}px`;
      fields.forEach((f) => { f.hidden = true; });
      done.hidden = false;
      done.focus({ preventScroll: true });
    });
    $(done, '[data-est-reset]').addEventListener('click', () => {
      done.hidden = true;
      fields.forEach((f) => { f.hidden = false; });
      form.style.minHeight = '';
      touched = false;
      showError(false);
      email.value = '';
      email.focus({ preventScroll: true });
    });
  })();

  // ---------------------------------------------------------------- In store
  (() => {
    const s = sectionOf('instore');
    if (!s) return;
    const items = $$(s, '[data-is-item]');
    const dots = $$(s, '[data-is-dot]');
    const check = $(s, '[data-is-phone="check"]');
    const offer = $(s, '[data-is-phone="offer"]');
    const handover = $(s, '[data-is-handover]');
    let current = -1;
    const select = (i) => {
      if (i === current) return;
      current = i;
      items.forEach((b, k) => b.setAttribute('aria-expanded', String(k === i)));
      dots.forEach((d, k) => { if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      check.classList.toggle('is-dim', i !== 0);
      offer.classList.toggle('is-dim', i === 0);
      handover.classList.toggle('is-on', i === 2);
      handover.setAttribute('aria-hidden', String(i !== 2));
    };
    select(0);
    const stop = autoAdvance(s, 6000, () => select((current + 1) % items.length));
    items.forEach((b, i) => b.addEventListener('click', () => { stop(); select(i); }));
    dots.forEach((d, i) => d.addEventListener('click', () => { stop(); select(i); }));
  })();

  // ---------------------------------------------------------------- Devices
  (() => {
    const s = sectionOf('devices');
    if (!s) return;
    const chips = $$(s, '[data-dv-chip]');
    if (!chips.length) return;
    const row = chips[0].parentElement;
    const note = document.createElement('p');
    note.id = 'dv-note';
    note.className = 'dv-note';
    note.setAttribute('aria-live', 'polite');
    row.after(note);
    let timer = 0;
    chips.forEach((c) => c.addEventListener('click', () => {
      chips.forEach((o) => o.setAttribute('aria-pressed', String(o === c)));
      note.textContent = `${c.dataset.dvChip} trade-in is available in every Fintegre program.`;
      note.classList.add('is-on');
      clearTimeout(timer);
      timer = setTimeout(() => {
        note.classList.remove('is-on');
        chips.forEach((o) => o.setAttribute('aria-pressed', 'false'));
      }, 3000);
    }));
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  })();
})();
