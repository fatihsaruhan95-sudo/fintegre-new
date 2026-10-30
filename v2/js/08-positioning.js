// Positioning: the CSS timeline starts on v2:in and pauses while the section is off screen.
(() => {
  const sec = document.querySelector('[data-section="positioning"]');
  if (!sec) return;
  let visible = false, started = false;
  const sync = () => sec.classList.toggle('pz-run', started && visible);
  sec.addEventListener('v2:in', () => { started = true; visible = true; sync(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(sec);
})();
