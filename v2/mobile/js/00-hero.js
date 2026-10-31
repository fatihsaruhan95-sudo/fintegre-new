// Mobile hero: live-valuation counter (€0 → €598 → €612) on arrival, and the full-screen mobile menu
// (opened by any [data-menu-open] button; closed by its close button, Escape or a tapped link).
(() => {
  const sec = document.querySelector('[data-section="hero"]');
  if (!sec) return;
  const root = document.documentElement;
  const motion = root.classList.contains('motion');

  // ---- Counter (Figma: €0 until 3.2 s, €598 at 3.35 s, €612 at 4.15 s while the bar fills) ----
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
    if (played || !motion || !price) return;
    played = true;
    price.textContent = '€0';
    tween(0, 598, 2800, 550).then(() => tween(598, 612, 650, 200));
  };
  sec.addEventListener('v2:in', play);
  if (sec.classList.contains('is-in')) play();
})();
