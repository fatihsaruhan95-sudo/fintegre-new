// Mobile "Lifecycle": the step ticker drifts left at the Figma speed (140 px per 8 s) as a seamless loop,
// starting with the section entrance and pausing while off-screen.
(() => {
  const sec = document.querySelector('[data-section="lifecycle"]');
  const tick = sec && sec.querySelector('.lc-ticker');
  if (!tick) return;
  const half = tick.scrollWidth / 2 || 875; // design px (inside the unscaled canvas)
  tick.style.setProperty('--lc-dur', (half / 17.5).toFixed(2) + 's');
  let arrived = sec.classList.contains('is-in'), visible = false;
  const sync = () => tick.classList.toggle('is-run', arrived && visible);
  sec.addEventListener('v2:in', () => { arrived = true; sync(); });
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; sync(); }).observe(sec);
})();
