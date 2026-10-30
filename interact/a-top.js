// Sections 1–4: rotating statement pills; generic data-href / data-menu-open / data-tour-open live in shell.js.
(() => {
  const pills = [...document.querySelectorAll('[data-rotate]')];
  if (!pills.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lists = pills.map((p) => p.dataset.rotate.split('|'));
  let step = 0;
  setInterval(() => {
    step++;
    pills.forEach((p, i) => {
      // Second pill trails the first slightly so the sentence changes in a wave.
      setTimeout(() => {
        p.classList.add('is-swapping');
        setTimeout(() => {
          p.textContent = lists[i][step % lists[i].length];
          p.classList.remove('is-swapping');
        }, 260);
      }, i * 180);
    });
  }, 3200);
})();
