// Positioning: the layers settle on arrival, then scrolling drives the rest of the story — the signal
// travels down through the layers, each layer answers, the offer travels back up. The CSS keyframes
// (14.5 s timeline) are paused and scrubbed through the Web Animations API.
(() => {
  const sec = document.querySelector('[data-section="positioning"]');
  if (!sec || !document.documentElement.classList.contains('motion')) return;
  const ENTRANCE = 1.5;   // s: plates, line — played on arrival
  const STORY_END = 6.7;  // s: offer chip has landed
  let anims = [], intro = 0, introDone = false;

  const setTime = (sec_) => { for (const a of anims) a.currentTime = sec_ * 1000; };
  const scrollTime = () => {
    const travel = sec.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-sec.getBoundingClientRect().top / Math.max(travel, 1), 0), 1);
    // Leave a short hold at the end so the finished state is readable before the page moves on.
    return ENTRANCE + Math.min(p / 0.85, 1) * (STORY_END - ENTRANCE);
  };
  const render = () => setTime(Math.max(introDone ? ENTRANCE : intro, introDone ? scrollTime() : 0));

  sec.addEventListener('v2:in', () => {
    sec.classList.add('pz-run');
    anims = sec.getAnimations({ subtree: true });
    anims.forEach((a) => a.pause());
    const t0 = performance.now();
    const tick = (now) => {
      intro = Math.min((now - t0) / 1000, ENTRANCE);
      if (intro >= ENTRANCE) introDone = true;
      render();
      if (!introDone) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { once: true });

  V2.onScroll(() => { if (introDone) render(); });

  // Taller than the screen, so it announces its own entrance.
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting || sec.classList.contains('is-in')) return;
    sec.classList.add('is-in');
    sec.dispatchEvent(new CustomEvent('v2:in'));
    io.disconnect();
  }, { rootMargin: '0px 0px -30% 0px' }).observe(sec);
})();
