// Intelligence: the three questions act as tabs (— on the open one, + on the rest); choosing one shows its
// panel and replays the chart.
(() => {
  const sec = document.querySelector('[data-section="intelligence"]');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('.in-tab')];
  const chart = sec.querySelector('.in-chart');
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.querySelector('.in-tab__icon').textContent = on ? '—' : '+';
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    chart.classList.add('is-replay');
    void chart.offsetWidth; // restart the bar transitions
    chart.querySelectorAll('.in-bar, .in-val, .bar').forEach((el) => {
      el.dataset.d0 ??= parseInt(el.style.getPropertyValue('--d'), 10) || 0;
      el.style.setProperty('--d', `${Math.max(0, el.dataset.d0 - 150)}ms`);
    });
    chart.classList.remove('is-replay');
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    tab.addEventListener('click', () => { if (tab.getAttribute('aria-selected') !== 'true') select(tab); });
    tab.addEventListener('keydown', (e) => {
      const n = tabs.length;
      const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1 + n, ArrowLeft: i - 1 + n }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(tabs[to % n], true);
    });
  });
})();
