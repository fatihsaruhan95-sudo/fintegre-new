// Article: the section is ~3.6 screens tall, so each chart/figure/quote reveals on its own as it scrolls in.
(() => {
  const blocks = document.querySelectorAll('[data-section="article"] .rv');
  if (!blocks.length) return;
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('r-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -20% 0px' });
  blocks.forEach((b) => io.observe(b));
})();
