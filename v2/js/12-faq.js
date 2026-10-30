// FAQ accordion: one item open at a time; height animates in CSS (grid rows 0fr -> 1fr).
(() => {
  const sec = document.querySelector('[data-section="faq"]');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.faq-item')];
  const set = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-q').setAttribute('aria-expanded', String(open));
    item.querySelector('.faq-a').inert = !open;
  };
  items.forEach((item, i) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((other) => set(other, other === item ? open : false));
    });
    // Arrow keys / Home / End move focus between questions.
    btn.addEventListener('keydown', (e) => {
      const n = items.length;
      const to = { ArrowDown: i + 1, ArrowUp: i - 1 + n, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      items[to % n].querySelector('.faq-q').focus();
    });
  });
})();
