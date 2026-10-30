// Section motion. Each section gets a recipe of [selector, effect, options]; elements are tagged with
// data-m and revealed when their section scrolls into view. Effects live in motion.css.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion');

  const $$ = (root, sel) => [...root.querySelectorAll(sel)];
  const sectionOf = (slug) => document.querySelector(`[data-section="${slug}"]`);

  // Thin bars (progress meters, chart grid lines…) found by shape rather than by name.
  const bars = (root) => $$(root, 'div').filter((el) => {
    const r = el.getBoundingClientRect();
    const bg = getComputedStyle(el).backgroundColor;
    return r.height > 0 && r.height <= 8 && r.width > 24 && bg !== 'rgba(0, 0, 0, 0)' && !el.children.length;
  });
  const directRules = (root) => $$(root, ':scope > [data-name="Rectangle"], :scope > div > [data-name="Rectangle"]');

  // effect: up | down | left | right | scale | fade | pop | zoom | draw-x | draw-y | wipe | bar
  // opts: delay (ms), stagger (ms between siblings), self (observe each element on its own)
  const recipes = {
    hero: [
      ['[data-name="Header pill"]', 'down', { delay: 100 }],
      ['[data-name="Bottom bar"]', 'up', { delay: 1000 }],
      ['[data-name="Floating contact"]', 'pop', { delay: 1400 }],
    ],
    statement: [
      ['[data-name="Statement"] > :first-child > :not([data-reveal])', 'up', { delay: 200, stagger: 120 }],
      ['[data-name="Photo card"]', 'scale', { delay: 250 }],
      ['img[src*="statement-photo"]', 'zoom', { delay: 250 }],
      ['[data-name="Metrics"]', 'up', { delay: 700 }],
      [(s) => bars(s.querySelector('[data-name="Metrics"]') || s), 'bar', { delay: 1100, stagger: 160 }],
    ],
    numbers: [
      ['[data-name="Numbers head"] > :not([data-reveal])', 'fade', { delay: 300 }],
      [(s) => directRules(s), 'draw-x', { delay: 200, stagger: 200 }],
      ['[data-name="Stats"] > :nth-child(odd)', 'up', { delay: 350, stagger: 140 }],
      ['[data-name="Stats"] > :nth-child(even)', 'draw-y', { delay: 600, stagger: 140 }],
    ],
    designed: [
      ['[data-name="Designed differently"] > :first-child > :not([data-reveal])', 'up', { delay: 100 }],
      ['[data-name^="Card ·"]', 'up', { delay: 250, stagger: 130 }],
      ['[data-name^="Card ·"] [data-name^="Icon"]', 'pop', { delay: 650, stagger: 130 }],
    ],
    services: [
      ['[data-name="Services head"] > :not([data-reveal])', 'fade', { delay: 300 }],
      ['[data-name^="Program ·"]', 'up', { delay: 250, stagger: 70 }],
    ],
    features: [
      ['[data-name^="Card ·"]', 'up', { self: true }],
      ['[data-name^="Card ·"] [data-name="Visual"], [data-name^="Card ·"] [data-name="Product UI · Valuation"]', 'scale', { self: true, delay: 150 }],
    ],
    intelligence: [
      ['[data-name="Intelligence panel"]', 'up', { delay: 150 }],
      ['[data-name="Intelligence panel"] > :first-child > *', 'up', { delay: 400, stagger: 90 }],
      ['[data-name="Grid"]', 'draw-x', { delay: 500, stagger: 80 }],
      ['[data-name^="Line ·"]', 'wipe', { delay: 700, stagger: 220 }],
      ['[data-name^="End ·"]', 'pop', { delay: 2000, stagger: 220 }],
    ],
    estimator: [
      [(s) => directRules(s), 'draw-x', { delay: 200 }],
      [(s) => { const f = s.querySelector('[data-name="Estimate form"]'); return f ? [...f.parentElement.firstElementChild.children] : []; }, 'up', { delay: 300, stagger: 110 }],
      ['[data-name="Estimate form"]', 'up', { delay: 250 }],
      ['[data-name="Estimate form"] button', 'pop', { delay: 600, stagger: 45 }],
    ],
    instore: [
      ['[data-name="Device stage"]', 'up', { delay: 150 }],
      ['[data-name="Accordion"] > *', 'up', { delay: 400, stagger: 110 }],
      ['[data-name^="Phone ·"]', 'right', { delay: 500, stagger: 180 }],
      ['[data-name="Pager row"]', 'fade', { delay: 1000 }],
    ],
    devices: [
      ['[data-name="Every device"] > :first-child > :not([data-reveal])', 'fade', { delay: 250 }],
      ['[data-name^="Device ·"]', 'scale', { delay: 250, stagger: 120 }],
      [(s) => [...(s.lastElementChild?.children || [])], 'up', { delay: 800, stagger: 60 }],
    ],
    fullbleed: [
      ['[data-name="Brand mark"]', 'pop', { delay: 200 }],
      [(s) => $$(s, 'a, button'), 'up', { delay: 500, stagger: 60 }],
      [(s) => $$(s, 'p:not([data-reveal])'), 'up', { delay: 350 }],
    ],
    resources: [
      ['[data-name="Report lead magnet"]', 'up', { delay: 150 }],
      ['[data-name="Copy"] > *', 'up', { delay: 400, stagger: 110 }],
      [(s) => $$(s, '[class*="rotate-["]'), 'up', { delay: 650, stagger: 160 }],
      ['[data-name="Specialist call"]', 'up', { delay: 450 }],
      ['[data-name="Specialist call"] button', 'pop', { delay: 800, stagger: 60 }],
    ],
    faq: [
      ['[data-faq-item]', 'up', { delay: 250, stagger: 80 }],
    ],
    closing: [
      ['[data-name="Footer"]', 'up', { delay: 300 }],
      ['[data-name="Footer"] > * > *', 'up', { delay: 550, stagger: 90 }],
    ],
  };

  // Once an element has played its entrance, drop its delay so hover/state transitions respond instantly.
  const settle = (el) => setTimeout(() => el.style.setProperty('--m-delay', '0ms'), 2600);
  const reveal = (el) => { el.classList.add('m-in'); settle(el); };

  const sectionIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      $$(e.target, '[data-m]:not([data-m-self])').forEach(reveal);
      e.target.dispatchEvent(new CustomEvent('section:in'));
      sectionIO.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -18% 0px' });

  const selfIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { reveal(e.target); selfIO.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px' });

  for (const [slug, recipe] of Object.entries(recipes)) {
    const s = sectionOf(slug);
    if (!s) continue;
    for (const [sel, effect, opts = {}] of recipe) {
      const els = typeof sel === 'function' ? sel(s).filter(Boolean) : $$(s, sel);
      els.forEach((el, i) => {
        if (el.dataset.m) return;
        el.dataset.m = effect;
        el.style.setProperty('--m-delay', `${(opts.delay || 0) + i * (opts.stagger || 0)}ms`);
        if (opts.self) { el.dataset.mSelf = ''; selfIO.observe(el); }
      });
    }
    // The hero is already on screen: play it on load.
    if (slug === 'hero') requestAnimationFrame(() => $$(s, '[data-m]').forEach(reveal));
    else sectionIO.observe(s);
  }

  // Numbers: count up the big figures (12, €240M, 3×) when the section arrives.
  const numbers = sectionOf('numbers');
  if (numbers) {
    const figures = $$(numbers, 'span').filter((el) => /^\s*\d+/.test(el.textContent) && parseFloat(getComputedStyle(el).fontSize) >= 48);
    const plans = figures.map((el) => {
      const m = el.textContent.match(/^(\s*)(\d+)(.*)$/s);
      el.textContent = `${m[1]}0${m[3]}`;
      return { el, pre: m[1], to: +m[2], post: m[3] };
    });
    numbers.addEventListener('section:in', () => {
      const start = performance.now() + 450, dur = 1600;
      const tick = (now) => {
        const t = Math.min(Math.max((now - start) / dur, 0), 1);
        const e = 1 - Math.pow(1 - t, 4);
        for (const p of plans) p.el.textContent = `${p.pre}${Math.round(p.to * e)}${p.post}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { once: true });
  }

  // Ambient loops: phones float, background glows drift.
  sectionOf('instore')?.querySelectorAll('[data-name="Titanium frame"]').forEach((el, i) => {
    el.classList.add('m-float');
    el.style.animationDelay = `${i * -2.2}s`;
  });
  for (const slug of ['numbers', 'features', 'resources']) {
    const s = sectionOf(slug);
    if (!s) continue;
    const glows = slug === 'numbers'
      ? $$(s, ':scope > [aria-hidden="true"]')
      : slug === 'resources'
        ? $$(s, '[data-name="Report lead magnet"] > [data-name="Ellipse"]') // not the avatar, which is also an Ellipse
        : $$(s, '[data-name="Ellipse"]');
    glows.forEach((el, i) => {
      el.classList.add('m-drift');
      el.style.animationDelay = `${i * -3.5}s`;
    });
  }

  // Ambient loops pause off screen so they cost nothing while you scroll past.
  const ambientIO = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('m-awake', e.isIntersecting);
  });
  document.querySelectorAll('.page > section').forEach((s) => { if (s.querySelector('.m-float, .m-drift')) ambientIO.observe(s); });

  // Parallax on full-bleed photos.
  const parallax = [
    ['hero', 'img[src*="hero-bg"]', 70],
    ['fullbleed', 'img[src*="fullbleed-photo"]', 90],
  ].map(([slug, sel, amp]) => {
    const s = sectionOf(slug);
    const img = s?.querySelector(sel);
    if (img) img.classList.add('m-parallax');
    return img && { s, img, amp };
  }).filter(Boolean);
  const onScroll = () => {
    const vh = window.innerHeight;
    for (const { s, img, amp } of parallax) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = (vh - r.top) / (vh + r.height); // 0 → 1 while the section crosses the screen
      img.style.translate = `0 ${((p - 0.5) * amp).toFixed(1)}px`;
    }
  };
  window.onScrollFrame(onScroll);
})();
