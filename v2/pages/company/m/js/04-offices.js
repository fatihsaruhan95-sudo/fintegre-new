// Offices: live local clocks per office, a selectable office card, and "How we work" chips that explain themselves.
(() => {
  const sec = document.querySelector('[data-section="offices"]');
  if (!sec) return;
  const zone = { 'Europe/Vilnius': ['EET', 'EEST', 2], 'Europe/Riga': ['EET', 'EEST', 2], 'Europe/Warsaw': ['CET', 'CEST', 1] };
  const clocks = [...sec.querySelectorAll('[data-tz]')];
  const draw = () => {
    const now = new Date();
    clocks.forEach((el) => {
      const tz = el.dataset.tz;
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'shortOffset' })
        .formatToParts(now).map((p) => [p.type, p.value]));
      const off = parseInt((parts.timeZoneName || '').replace('GMT', '') || '0', 10);
      const [std, dst, base] = zone[tz] || ['', '', 0];
      el.textContent = `${parts.hour}:${parts.minute} ${off > base ? dst : std}`;
    });
  };
  try { draw(); } catch (e) { /* keep the static times */ }
  let timer = 0;
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting) { try { draw(); timer = setInterval(draw, 15000); } catch (err) { /* static */ } }
  }).observe(sec);

  const radio = (list, onPick) => list.forEach((b) => b.addEventListener('click', () => {
    list.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (onPick) onPick(b);
  }));
  radio([...sec.querySelectorAll('.co-office')]);
  const note = sec.querySelector('.co-note');
  radio([...sec.querySelectorAll('.co-chip')], (b) => { if (note) note.textContent = b.dataset.note; });
})();
