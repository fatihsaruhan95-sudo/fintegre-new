// Click-through deck: each click plays the next step of a slide, then moves to the next slide.
(function () {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.s')];
  const foot = stage.querySelector('.foot');
  const page = foot.querySelector('[data-page]');
  const bar = document.querySelector('.bar');
  const hudPage = document.querySelector('[data-hud-page]');
  const presenter = new URLSearchParams(location.search).has('presenter');
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('fintegre-sunum' + location.pathname) : null;
  const pad = n => String(n).padStart(2, '0');

  const maxStep = slides.map(s => {
    let max = 0;
    s.querySelectorAll('[data-in],[data-dim],[data-out]').forEach(el => {
      ['in', 'dim', 'out'].forEach(k => { if (el.dataset[k]) max = Math.max(max, +el.dataset[k]); });
    });
    return max;
  });
  const minStep = slides.map(s => +(s.dataset.start || 0));
  const total = maxStep.reduce((a, b, i) => a + b - minStep[i] + 1, 0);

  let cur = 0, step = 0, transition = null, swapping = false, queued = [];

  function apply(slide, k) {
    slide.querySelectorAll('[data-in],[data-dim],[data-out]').forEach(el => {
      const d = el.dataset;
      if (d.in) el.classList.toggle('is-in', k >= +d.in);
      if (d.dim) el.classList.toggle('is-dim', k >= +d.dim);
      if (d.out) el.classList.toggle('is-out', k >= +d.out);
    });
  }

  function chrome() {
    const s = slides[cur];
    document.body.classList.toggle('is-light', s.classList.contains('light'));
    document.body.style.background = s.dataset.bg || '';
    foot.classList.toggle('hide', s.hasAttribute('data-nofoot'));
    page.textContent = pad(cur + 1);
    let done = step - minStep[cur] + 1;
    for (let i = 0; i < cur; i++) done += maxStep[i] - minStep[i] + 1;
    if (bar) bar.style.width = (done / total * 100) + '%';
    if (hudPage) hudPage.textContent = (cur + 1) + ' / ' + slides.length;
    history.replaceState(null, '', location.pathname + location.search + '#' + (cur + 1) + '.' + step);
    if (channel) channel.postMessage({ s: cur, k: step });
    if (presenter) renderNotes();
  }

  // The first item follows the title in, a beat later.
  function enter(slide, k) {
    slide.classList.add('entering');
    apply(slide, k);
    setTimeout(() => slide.classList.remove('entering'), 1600);
  }

  // Swap slides. Forward entrances play live behind the dissolve; going back lands on the finished state.
  function swap(to, k, back) {
    const from = slides[cur];
    const next = slides[to];
    document.documentElement.dataset.dir = back ? 'back' : 'fwd';
    const change = () => {
      from.classList.remove('on');
      next.classList.add('on');
      next.classList.add('noanim');
      apply(next, back ? k : -1);
      void next.offsetWidth;
      next.classList.remove('noanim');
      cur = to; step = k;
      chrome();
      swapping = false;
      queued.splice(0).forEach(fn => fn());
    };
    swapping = true;
    if (transition) transition.skipTransition();
    if (document.startViewTransition && !presenter) {
      transition = document.startViewTransition(change);
      const clear = () => { transition = null; };
      transition.finished.then(clear, clear);
      if (!back) transition.ready.then(() => enter(next, k), () => enter(next, k));
    } else {
      change();
      if (!back) requestAnimationFrame(() => enter(next, k));
    }
  }

  function jump(to, k) {
    to = Math.max(0, Math.min(slides.length - 1, to));
    k = Math.max(minStep[to], Math.min(maxStep[to], k));
    const next = slides[to];
    slides.forEach(s => s.classList.remove('on'));
    next.classList.add('on', 'noanim');
    apply(next, k);
    void next.offsetWidth;
    next.classList.remove('noanim');
    cur = to; step = k;
    chrome();
  }

  // The swap commits a frame later; a click landing before that waits its turn instead of getting lost.
  function next() {
    if (swapping) { queued.push(next); return; }
    if (step < maxStep[cur]) { step++; apply(slides[cur], step); chrome(); }
    else if (cur < slides.length - 1) swap(cur + 1, minStep[cur + 1], false);
  }
  function prev() {
    if (swapping) { queued.push(prev); return; }
    if (step > minStep[cur]) { step--; apply(slides[cur], step); chrome(); }
    else if (cur > 0) swap(cur - 1, maxStep[cur - 1], true);
  }

  function fit() {
    if (presenter) {
      const w = window.innerWidth * .56;
      stage.style.transform = 'scale(' + w / 1920 + ')';
      return;
    }
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }

  // Presenter window: stays in sync with the main one and keeps the speaker notes off the shared screen.
  function openPresenter() {
    window.open(location.pathname + '?presenter#' + (cur + 1) + '.' + step, 'fintegre-presenter', 'width=1280,height=760');
  }
  let t0 = null;
  function renderNotes() {
    const id = slides[cur].dataset.id;
    const box = document.querySelector('.pv__notes');
    box.textContent = (window.DECK_NOTES && window.DECK_NOTES[id]) || '';
    const left = maxStep[cur] - step;
    const after = slides[cur + 1];
    document.querySelector('.pv__next').textContent =
      'Slide ' + (cur + 1) + ' / ' + slides.length + ' · ' +
      (left ? left + ' click' + (left > 1 ? 's' : '') + ' left here' : after ? 'Next: ' + after.dataset.title : 'Last slide');
  }
  if (presenter) {
    document.body.classList.add('presenter');
    const sc = document.createElement('script');
    sc.src = document.documentElement.dataset.notesSrc || 'notes.js';
    sc.onload = renderNotes;
    document.head.appendChild(sc);
    const clock = document.querySelector('.pv__clock');
    setInterval(() => {
      if (t0 === null) { clock.textContent = '00:00'; return; }
      const sec = Math.floor((Date.now() - t0) / 1000);
      clock.textContent = pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);
    }, 500);
  }
  if (channel) channel.onmessage = e => {
    const { s, k } = e.data;
    if (s === cur && k === step) return;
    if (t0 === null) t0 = Date.now();
    if ((s === cur && k === step + 1) || (s === cur + 1 && k === minStep[s] && step === maxStep[cur])) next();
    else if ((s === cur && k === step - 1) || (s === cur - 1 && k === maxStep[s] && step === minStep[cur])) prev();
    else jump(s, k);
  };

  let typed = '';
  window.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key;
    if (/^[0-9]$/.test(key)) { typed += key; return; }
    if (key === 'Enter' && typed) { e.preventDefault(); jump(+typed - 1, minStep[+typed - 1] || 0); typed = ''; return; }
    typed = '';
    if ([' ', 'ArrowRight', 'ArrowDown', 'PageDown', 'Enter'].includes(key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(key)) { e.preventDefault(); prev(); }
    else if (key === 'Home') jump(0, 0);
    else if (key === 'End') jump(slides.length - 1, maxStep[slides.length - 1]);
    else if (key === 'f' || key === 'F') fullscreen();
    else if (key === 'p' || key === 'P') openPresenter();
    else if (key === 't' || key === 'T') switchTheme();
  });

  window.addEventListener('click', e => {
    if (e.target.closest('.hud') || e.target.closest('.pv') || e.target.closest('.theme')) return;
    next();
  });
  function switchTheme() { location.href = stage.querySelector('.theme').dataset.themeHref + location.hash; }
  stage.querySelector('.theme').addEventListener('click', switchTheme);
  document.querySelector('[data-prev]').addEventListener('click', prev);
  document.querySelector('[data-next]').addEventListener('click', next);
  document.querySelector('[data-full]').addEventListener('click', fullscreen);
  document.querySelector('[data-notes]').addEventListener('click', openPresenter);

  let tx = null;
  window.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) { e.preventDefault(); dx < 0 ? next() : prev(); }
    tx = null;
  });

  // Controls and cursor rest until the mouse moves.
  let idle;
  window.addEventListener('mousemove', () => {
    document.body.classList.add('moved');
    document.body.classList.remove('idle');
    clearTimeout(idle);
    idle = setTimeout(() => { document.body.classList.remove('moved'); document.body.classList.add('idle'); }, 1800);
  });

  // Decode every image up front so no slide pops in mid-talk.
  stage.querySelectorAll('img').forEach(img => { if (img.decode) img.decode().catch(() => {}); });

  window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#(\d+)(?:\.(\d+))?$/);
    if (m && (+m[1] - 1 !== cur || +(m[2] || 0) !== step)) jump(+m[1] - 1, +(m[2] || 0));
  });

  fit();
  const m = location.hash.match(/^#(\d+)(?:\.(\d+))?$/);
  if (m) jump(+m[1] - 1, +(m[2] || 0));
  else {
    slides[0].classList.add('on', 'noanim');
    apply(slides[0], -1);
    void slides[0].offsetWidth;
    slides[0].classList.remove('noanim');
    chrome();
    requestAnimationFrame(() => requestAnimationFrame(() => apply(slides[0], 0)));
  }
})();
