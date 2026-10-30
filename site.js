// From 1024px up the design is a 1440×900 canvas: scale it so one section always fits the screen, then spend
// any spare width as side bleed (backgrounds edge to edge, 1440 content centred). Below 1024px the page is
// fluid and the sections' own max-lg:/max-md: classes take over.
const FLUID_BELOW = 1024;
// One scroll listener for the whole page: tasks run at most once per frame, never inside the scroll event.
const scrollTasks = [];
const onScrollFrame = (fn) => { scrollTasks.push(fn); fn(); };
window.onScrollFrame = onScrollFrame;
(() => {
  let queued = false;
  const run = () => { queued = false; for (const fn of scrollTasks) fn(); };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
})();
// Dev aid: ?only=<slug> renders a single section, for checking it at different widths.
(() => {
  const only = new URLSearchParams(location.search).get('only');
  if (only) document.querySelectorAll(`.page > section:not([data-section="${only}"])`).forEach((s) => s.remove());
})();
const isCanvas = () => window.innerWidth >= FLUID_BELOW;
(() => {
  const DESIGN_W = 1440, DESIGN_H = 900;
  const sections = [...document.querySelectorAll('.page > section')];
  const px = (v) => parseFloat(v) || 0;
  // Remember each section's own padding and its absolutely positioned children, measured in canvas mode.
  let captured = false;
  const capture = () => {
    for (const s of sections) {
      const cs = getComputedStyle(s);
      s.dataset.pl = px(cs.paddingLeft);
      s.dataset.pr = px(cs.paddingRight);
      for (const c of s.children) {
        if (getComputedStyle(c).position !== 'absolute') continue;
        c.dataset.abs = c.offsetWidth >= DESIGN_W - 1 ? 'layer' : String(c.offsetLeft);
      }
    }
    captured = true;
  };
  const clear = () => {
    document.body.style.zoom = '';
    document.querySelector('.page').style.width = '';
    for (const s of sections) {
      s.style.paddingLeft = s.style.paddingRight = '';
      for (const c of s.children) if (c.dataset.abs) c.style.left = c.style.width = '';
    }
  };
  const fit = () => {
    document.documentElement.classList.toggle('is-fluid', !isCanvas());
    if (!isCanvas()) { clear(); return; }
    if (!captured) { clear(); document.querySelector('.page').style.width = DESIGN_W + 'px'; capture(); }
    const zoom = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
    const pageW = window.innerWidth / zoom;
    const bleed = Math.max(0, (pageW - DESIGN_W) / 2);
    document.body.style.zoom = String(zoom);
    document.querySelector('.page').style.width = pageW + 'px';
    for (const s of sections) {
      const absLayout = [...s.children].some((c) => c.dataset.abs) && !s.querySelector(':scope > :not([data-abs])');
      if (!absLayout) {
        s.style.paddingLeft = (+s.dataset.pl + bleed) + 'px';
        s.style.paddingRight = (+s.dataset.pr + bleed) + 'px';
      }
      for (const c of s.children) {
        if (!c.dataset.abs) continue;
        if (c.dataset.abs === 'layer') { c.style.left = '0px'; c.style.width = '100%'; }
        else c.style.left = (+c.dataset.abs + bleed) + 'px';
      }
    }
  };
  fit();
  window.addEventListener('resize', fit);
})();

// Header: hidden near the top, hidden while scrolling down, shown on scroll up.
(() => {
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  onScrollFrame(() => {
    const y = window.scrollY;
    if (y < 400 || y > lastY + 2) header.classList.remove('is-visible');
    else if (y < lastY - 2) header.classList.add('is-visible');
    lastY = y;
  });
})();

// Headline reveals.
(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    // Hero lines rise in on load, the subline slightly after the headline.
    if (el.closest('[data-section="hero"]')) {
      setTimeout(() => el.classList.add('is-in'), 200 + i * 400);
    } else io.observe(el);
  });
})();

// Sticky features: highlight the list item for the card nearest the viewport centre.
(() => {
  const items = [...document.querySelectorAll('[data-feature-item]')];
  const cards = [...document.querySelectorAll('[data-feature-card]')];
  if (!items.length || !cards.length) return;
  // Each item has a highlight layer and a label; only the active item shows the highlight at full label opacity.
  const setActive = (idx) => {
    items.forEach((it, i) => {
      const on = i === idx;
      it.classList.toggle('is-active', on);
      const hl = it.querySelector('[data-feature-active]');
      const label = it.querySelector('[data-feature-label]');
      if (hl) hl.style.opacity = on ? '1' : '0';
      if (label) label.style.opacity = on ? '1' : '0.6';
    });
  };
  setActive(0);

  // CSS sticky breaks under the page zoom. Instead the column switches between three states only when it crosses
  // a boundary: in flow (before), position: fixed (pinned, scrolls with the compositor, no per-frame JS) and
  // parked at the end of its travel (after).
  const section = items[0].closest('[data-section]');
  const col = section.querySelector('[class*="sticky"]');
  if (col) col.classList.remove('sticky');
  const holder = document.createElement('div');
  holder.setAttribute('aria-hidden', 'true');
  let state = '';
  const travel = () => section.offsetHeight - col.offsetHeight - parseFloat(getComputedStyle(col).marginTop) * 2;
  const setState = (next) => {
    if (next === state) return;
    // Measure in flow before changing anything.
    if (state === 'pinned') { holder.remove(); }
    Object.assign(col.style, { position: '', top: '', left: '', width: '', transform: '' });
    if (next === 'pinned') {
      const z = parseFloat(document.body.style.zoom) || 1;
      const r = col.getBoundingClientRect();
      holder.style.cssText = `width:${col.offsetWidth}px;flex-shrink:0`;
      col.before(holder);
      Object.assign(col.style, { position: 'fixed', top: '0px', left: `${r.left / z}px`, width: `${r.width / z}px`, zIndex: '2' });
    } else if (next === 'after') {
      col.style.transform = `translateY(${Math.max(travel(), 0)}px)`;
    }
    state = next;
  };
  const pin = () => {
    if (!col) return;
    if (!isCanvas()) { setState('off'); return; }
    const z = parseFloat(document.body.style.zoom) || 1;
    const scrolled = -section.getBoundingClientRect().top / z;
    setState(scrolled < 0 ? 'before' : scrolled > travel() ? 'after' : 'pinned');
  };
  onScrollFrame(pin);
  window.addEventListener('resize', () => { state = ''; pin(); });

  onScrollFrame(() => {
    const top = section.getBoundingClientRect();
    if (top.bottom < 0 || top.top > window.innerHeight) return;
    const mid = window.innerHeight / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  });
})();

// FAQ accordion: one item open at a time. Open items are white with a minus icon, closed ones 60% white with a plus.
(() => {
  const items = [...document.querySelectorAll('[data-faq-item]')];
  const OPEN_BG = 'bg-white', CLOSED_BG = 'bg-[rgba(255,255,255,0.6)]';
  const open = (it, on) => {
    const a = it.querySelector('[data-faq-answer]');
    const btn = it.querySelector('button[aria-expanded]') || it;
    const icon = it.querySelector('[data-faq-icon]');
    if (a) {
      // Closed answers use Tailwind's `hidden` so they take no space in the item's flex gap.
      if (on) {
        a.classList.remove('hidden');
        a.style.maxHeight = '0px';
        a.style.opacity = '0';
        void a.offsetHeight;
        a.style.maxHeight = a.scrollHeight + 'px';
        a.style.opacity = '1';
        // After opening, release the cap so text can reflow on resize without being cut off.
        a.addEventListener('transitionend', () => { if (btn.getAttribute('aria-expanded') === 'true') a.style.maxHeight = 'none'; }, { once: true });
      } else {
        a.classList.add('hidden');
        a.style.maxHeight = '0px';
        a.style.opacity = '0';
      }
    }
    btn.setAttribute('aria-expanded', String(on));
    it.classList.toggle(OPEN_BG, on);
    it.classList.toggle(CLOSED_BG, !on);
    if (icon) icon.src = on ? 'assets/faq-icon-subtract.svg' : 'assets/faq-icon-add.svg';
  };
  items.forEach((it) => {
    open(it, it.hasAttribute('data-open'));
    const btn = it.querySelector('button[aria-expanded]') || it;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      items.forEach((o) => open(o, false));
      open(it, !isOpen);
    });
  });
})();

// Decode every image while the page is idle, so photos are ready before they scroll into view.
window.addEventListener('load', () => {
  const imgs = [...document.images];
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  const next = () => { const img = imgs.shift(); if (!img) return; (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).finally(() => idle(next)); };
  idle(next);
});
