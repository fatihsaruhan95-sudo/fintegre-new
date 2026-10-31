// Company hero: the "Vilnius ops · today" counter counts up on arrival, then keeps ticking while on screen.
(() => {
  const sec = document.querySelector('[data-section="hero"]');
  const el = sec && sec.querySelector('[data-ops-count]');
  if (!el) return;
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  let value = 4812, timer = 0, visible = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = () => {
    clearTimeout(timer);
    if (!visible || reduce) return;
    timer = setTimeout(() => { value += 1 + Math.floor(Math.random() * 3); el.textContent = fmt(value); tick(); }, 2200 + Math.random() * 1600);
  };
  sec.addEventListener('v2:in', () => {
    if (reduce) return;
    const from = 4200, t0 = performance.now() + 1800, dur = 1400;
    const step = (t) => {
      const k = Math.min(1, Math.max(0, (t - t0) / dur));
      el.textContent = fmt(from + (value - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step); else tick();
    };
    el.textContent = fmt(from);
    requestAnimationFrame(step);
  }, { once: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) tick(); else clearTimeout(timer); }).observe(sec);
})();
