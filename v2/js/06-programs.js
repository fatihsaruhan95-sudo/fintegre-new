// Programs carousel: arrows, pager dots, mouse drag, wheel/trackpad scroll with snapping,
// and auto-advance every 2.5 s while on screen (paused on hover, focus and drag).
(() => {
  const sec = document.querySelector('[data-section="programs"]');
  if (!sec) return;
  const scroller = sec.querySelector('.pg-scroller');
  const items = [...sec.querySelectorAll('.pg-item')];
  const dots = [...sec.querySelectorAll('.pg-dot')];
  const prev = sec.querySelector('.pg-arrow[data-dir="-1"]');
  const next = sec.querySelector('.pg-arrow[data-dir="1"]');
  const STEP = 424; // card 400 + gap 24, in canvas px (scrollLeft is in the canvas' own units)
  const last = items.length - 1;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inout = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let index = 0, anim = 0, programmatic = false;
  const maxScroll = () => scroller.scrollWidth - scroller.clientWidth;
  const posOf = (i) => Math.min(i * STEP, maxScroll());
  const nearest = () => Math.max(0, Math.min(last, Math.round(scroller.scrollLeft / STEP)));

  const paint = (i) => {
    dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', String(k === i)); });
    prev.disabled = i === 0;
  };

  const go = (i, dur = 900) => {
    index = ((i % items.length) + items.length) % items.length;
    paint(index);
    cancelAnimationFrame(anim);
    const from = scroller.scrollLeft, to = posOf(index), t0 = performance.now();
    if (reduce || dur === 0 || Math.abs(to - from) < 1) { scroller.scrollLeft = to; return; }
    programmatic = true;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      scroller.scrollLeft = from + (to - from) * inout(t);
      if (t < 1) anim = requestAnimationFrame(tick); else programmatic = false;
    };
    anim = requestAnimationFrame(tick);
  };

  // Keep dots in sync with free scrolling, snap to the nearest card once scrolling settles.
  let settle = 0;
  scroller.addEventListener('scroll', () => {
    if (programmatic || dragging) return;
    const i = nearest();
    if (i !== index) { index = i; paint(i); }
    clearTimeout(settle);
    settle = setTimeout(() => { if (!dragging && !programmatic) go(nearest(), 450); }, 160);
  }, { passive: true });

  // Mouse drag (touch uses native scrolling).
  let dragging = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0;
  scroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cancelAnimationFrame(anim); programmatic = false;
    dragging = true; moved = false; startX = lastX = e.clientX; lastT = performance.now(); vel = 0;
    startLeft = scroller.scrollLeft;
    scroller.setPointerCapture(e.pointerId);
  });
  scroller.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const s = window.V2 ? V2.scale() : 1;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4 && !moved) { moved = true; scroller.classList.add('is-dragging'); }
    scroller.scrollLeft = startLeft - dx / s;
    const now = performance.now();
    vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
    const i = nearest();
    if (i !== index) { index = i; paint(i); }
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove('is-dragging');
    if (!moved) return;
    let i = nearest();
    if (Math.abs(vel) > 0.4) i = Math.round(scroller.scrollLeft / STEP + (vel < 0 ? 0.5 : -0.5));
    go(Math.max(0, Math.min(last, i)), 600);
    restart();
  };
  scroller.addEventListener('pointerup', end);
  scroller.addEventListener('pointercancel', end);
  scroller.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  const flash = (btn) => { btn.classList.add('is-flash'); setTimeout(() => btn.classList.remove('is-flash'), 200); };
  prev.addEventListener('click', () => { if (index > 0) go(index - 1); restart(); });
  next.addEventListener('click', () => { go(index === last ? 0 : index + 1); restart(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); restart(); }));
  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(last, index + 1)); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, index - 1)); restart(); }
  });

  // Auto-advance: only while the section is on screen, not hovered, focused or dragged.
  let timer = 0, visible = false, hover = false, focus = false, started = false;
  const stop = () => { clearInterval(timer); timer = 0; };
  const restart = () => {
    stop();
    if (reduce || !started || !visible || hover || focus || dragging) return;
    timer = setInterval(() => { flash(next); go(index === last ? 0 : index + 1); }, 2500);
  };
  scroller.addEventListener('pointerenter', () => { hover = true; stop(); });
  scroller.addEventListener('pointerleave', () => { hover = false; restart(); });
  sec.addEventListener('focusin', () => { focus = true; stop(); });
  sec.addEventListener('focusout', () => { focus = false; restart(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: 0.35 }).observe(sec);
  // First advance waits for the staggered entrance to finish.
  sec.addEventListener('v2:in', () => setTimeout(() => { started = true; restart(); }, 1200), { once: true });
  window.addEventListener('resize', () => go(index, 0));

  paint(0);
})();
