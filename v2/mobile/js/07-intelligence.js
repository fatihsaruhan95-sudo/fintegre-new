// Intelligence (mobile): the four views act as tabs (— on the open one, + on the rest); tapping one replays the bars.
(() => {
  const sec = document.querySelector('[data-section="intelligence"]');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('.in-tab')];
  const chart = sec.querySelector('.in-chart');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.querySelector('.in-tab__icon').textContent = on ? '—' : '+';
    });
    chart.classList.add('is-replay');
    void chart.offsetWidth; // restart the bar transitions
    chart.querySelectorAll('.in-bar, .in-val').forEach((el) => {
      el.dataset.d0 ??= parseInt(el.style.getPropertyValue('--d'), 10) || 0;
      el.style.setProperty('--d', `${Math.max(0, el.dataset.d0 - 550)}ms`);
    });
    chart.classList.remove('is-replay');
  }));
})();
