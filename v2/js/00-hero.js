// Hero: sample valuation counter (€0 → €598 → €612) on arrival, and the Figma 5.2–7.4 s "scroll-out"
// segment mapped onto scrolling through the first ~70% of the hero.
(() => {
  const sec = document.querySelector('[data-section="hero"]');
  if (!sec) return;
  const motion = document.documentElement.classList.contains('motion');

  // ---- Counter ----
  const price = sec.querySelector('[data-hero-price]');
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const tween = (from, to, delay, dur) => new Promise((res) => {
    const t0 = performance.now() + delay;
    const step = (now) => {
      const t = Math.min(Math.max((now - t0) / dur, 0), 1);
      price.textContent = '€' + Math.round(from + (to - from) * outCubic(t));
      if (t < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  let played = false;
  const play = () => {
    if (played || !motion) return;
    played = true;
    price.textContent = '€0';
    // Figma: €0 until 3.2 s, €598 at 3.35 s, €612 at 4.15 s (counts while the bar fills, 2.8–4.2 s).
    tween(0, 598, 2800, 550).then(() => tween(598, 612, 650, 200));
  };
  sec.addEventListener('v2:in', play);
  if (sec.classList.contains('is-in')) play();

  // ---- Scroll-out ----
  if (!motion) return;
  // cubic-bezier(.65,0,.25,1) solver (Figma's in-out curve)
  const bez = (x1, y1, x2, y2) => (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
      const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
      if (Math.abs(cx) < 1e-5 || !d) break;
      t -= cx / d;
    }
    t = Math.min(Math.max(t, 0), 1);
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  };
  const ease = bez(0.65, 0, 0.25, 1);
  const q = (k) => sec.querySelector(`[data-hs="${k}"]`);
  // start = Figma second the element begins moving; each move lasts 2 s.
  const parts = [
    { el: q('phone'), start: 5.2, f: (e) => `translateY(${-90 * e}px) rotate(${7 * e}deg) scale(${1 - 0.14 * e})` },
    { el: q('fibres'), start: 5.24, f: (e) => `translateY(${-118 * e}px)` },
    { el: q('scan'), start: 5.2, f: (e) => `translateY(${-110 * e}px)` },
    { el: q('chip-buyers'), start: 5.28, f: (e) => `translateY(${-126 * e}px)` },
    { el: q('chip-battery'), start: 5.32, f: (e) => `translateY(${-134 * e}px)` },
    { el: q('chip-screen'), start: 5.36, f: (e) => `translateY(${-142 * e}px)` },
    { el: q('card'), start: 5.4, f: (e) => `translateY(${-150 * e}px)` },
    { el: q('copy'), start: 5.2, f: (e) => `translateY(${-60 * e}px)`, o: (e) => 1 - 0.65 * e },
    { el: q('stats'), start: 5.2, o: (e) => 1 - 0.8 * e },
  ];
  let last = -1;
  window.V2.onScroll(() => {
    const h = sec.offsetHeight || 1;
    const p = Math.min(Math.max(scrollY / (h * 0.7), 0), 1);
    if (p === last) return;
    last = p;
    const t = 5.2 + p * 2.2; // 5.2 s → 7.4 s (last element finishes)
    for (const it of parts) {
      if (!it.el) continue;
      const e = ease(Math.min(Math.max((t - it.start) / 2, 0), 1));
      if (it.f) it.el.style.transform = e ? it.f(e) : '';
      if (it.o) it.el.style.opacity = e ? String(it.o(e)) : '';
    }
  });
})();
