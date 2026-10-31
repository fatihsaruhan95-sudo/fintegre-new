// "Tell us how you sell": business radios, market toggles, devices slider, browser-side validation and a success state (no backend).
(() => {
  const sec = document.querySelector('[data-section="talk"]');
  if (!sec) return;
  const form = sec.querySelector('form');
  const slider = sec.querySelector('.k-slider');
  const range = slider.querySelector('input');
  const val = sec.querySelector('.k-val');
  const note = sec.querySelector('.k-note');
  const noteText = note.textContent;
  const fmt = new Intl.NumberFormat('en-US');

  // 0..1000 on the slider → 100..13,000 devices a month (quadratic, so the low end has room), rounded.
  const devices = (v) => {
    const n = 100 + Math.pow(v / 1000, 2) * 12900;
    return n < 1000 ? Math.round(n / 50) * 50 : Math.round(n / 500) * 500;
  };
  const paint = () => {
    const p = range.value / 1000;
    slider.style.setProperty('--p', p);
    const n = devices(+range.value);
    val.textContent = (n >= 13000 ? 'more than ' : 'about ') + fmt.format(n);
    range.setAttribute('aria-valuetext', val.textContent + ' devices');
  };
  range.addEventListener('input', paint);
  paint();

  sec.querySelectorAll('.k-mk button').forEach((b) =>
    b.addEventListener('click', () => {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      note.textContent = noteText; note.classList.remove('is-err');
    }));
  form.addEventListener('change', () => { note.textContent = noteText; note.classList.remove('is-err'); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const biz = form.querySelector('input[name="business"]:checked');
    const markets = [...sec.querySelectorAll('.k-mk button[aria-pressed="true"]')].map((b) => b.textContent.trim());
    let err = '';
    if (!biz) err = 'Pick your business first';
    else if (!markets.length) err = 'Pick at least one market';
    if (err) { note.textContent = err; note.classList.add('is-err'); return; }
    const list = markets.length > 2 ? markets.slice(0, -1).join(', ') + ' and ' + markets.at(-1) : markets.join(' and ');
    sec.querySelector('[data-done-text]').textContent =
      `${biz.value}, ${list}, ${val.textContent} devices a month. We come back within one working day with a program outline and example numbers.`;
    form.classList.add('is-sent');
    sec.querySelector('[data-reset]').focus({ preventScroll: true });
  });
  sec.querySelector('[data-reset]').addEventListener('click', () => form.classList.remove('is-sent'));
})();
