// Tall mobile sections: parts marked data-seen play their entrance when they scroll into view (after the section itself is in).
(() => {
  const els = document.querySelectorAll('[data-sol] [data-seen]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-seen')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-seen'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  els.forEach((e) => io.observe(e));
})();
