// What we believe: the indigo dot follows the principle under the pointer / focus / tap.
(() => {
  const sec = document.querySelector('[data-section="believe"]');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.cb-item')];
  const set = (it) => items.forEach((x) => x.classList.toggle('is-active', x === it));
  items.forEach((it) => {
    it.addEventListener('pointerenter', () => set(it));
    it.addEventListener('focus', () => set(it));
    it.addEventListener('click', () => set(it));
  });
})();
