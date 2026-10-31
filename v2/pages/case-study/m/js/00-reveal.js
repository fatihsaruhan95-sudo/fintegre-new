// Tall mobile sections: groups marked [data-sub] hold their entrances until they themselves scroll into view.
(() => {
  const subs = document.querySelectorAll('[data-sub]');
  if (!subs.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  subs.forEach((s) => io.observe(s));
})();
