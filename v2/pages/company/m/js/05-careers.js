// Careers: "See all 9 open roles" opens the full list with office filters; each role opens like an accordion
// with a short brief and an apply link. The highlighted (indigo) row follows the pointer / the open role.
(() => {
  const sec = document.querySelector('[data-section="careers"]');
  if (!sec) return;
  const card = sec.querySelector('.cr-card');
  const toggle = sec.querySelector('[data-roles-toggle]');
  const roles = [...sec.querySelectorAll('.cr-role')];
  const tabs = [...sec.querySelectorAll('.cr-tab')];
  const count = sec.querySelector('[data-roles-count]');
  const hot = (r) => roles.forEach((x) => x.classList.toggle('is-hot', x === r));
  const open = (r, on) => {
    r.classList.toggle('is-open', on);
    r.querySelector('.cr-role__h').setAttribute('aria-expanded', String(on));
    r.querySelector('.cr-role__d').inert = !on;
  };
  roles.forEach((r) => {
    open(r, false);
    const h = r.querySelector('.cr-role__h');
    h.addEventListener('click', () => {
      const on = !r.classList.contains('is-open');
      roles.forEach((x) => open(x, x === r ? on : false));
      hot(r);
    });
    r.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !roles.some((x) => x.classList.contains('is-open'))) hot(r); });
  });
  const filter = (office) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.office === office)));
    let n = 0;
    roles.forEach((r) => { const show = office === 'all' || r.dataset.office === office; r.hidden = !show; if (show) n++; if (!show) open(r, false); });
    if (count) count.textContent = `${n} open role${n === 1 ? '' : 's'}`;
  };
  tabs.forEach((t) => t.addEventListener('click', () => filter(t.dataset.office)));
  toggle.addEventListener('click', () => {
    const all = !card.classList.contains('is-all');
    card.classList.toggle('is-all', all);
    toggle.setAttribute('aria-expanded', String(all));
    toggle.textContent = all ? 'Show fewer roles' : 'See all 9 open roles';
    if (!all) { filter('all'); roles.forEach((r) => open(r, false)); if (count) count.textContent = 'Open roles'; }
    else { filter('all'); }
  });
})();
