// Devices: scroll story. The section is four screens tall; a sticky screen moves the stage one slide
// per screen of scroll, with a hold on each slide, ±260 px photo parallax, copy fades and progress.
(() => {
  const sec = document.querySelector('[data-section="devices"]');
  if (!sec) return;
  const stage = sec.querySelector('.dv-stage');
  const slides = [...sec.querySelectorAll('.dv-slide')];
  const photos = slides.map((s) => s.querySelector('.dv-photo'));
  const copies = slides.map((s) => s.querySelector('.dv-copy'));
  const segs = [...sec.querySelectorAll('.dv-seg-on')];
  const labels = [...sec.querySelectorAll('[data-go]')];
  const N = slides.length;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const inout = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const HOLD = 0.18; // share of each step spent resting on a slide (each side)

  // Scroll progress 0..1 across the pinned range -> slide position 0..N-1 with eased steps.
  const progress = () => {
    const r = sec.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
  };
  const toPos = (p) => {
    const raw = clamp(p * N - 0.5, 0, N - 1);
    const i = Math.min(Math.floor(raw), N - 2), t = raw - i;
    return i + inout(clamp((t - HOLD) / (1 - 2 * HOLD), 0, 1));
  };

  let last = -1;
  const render = () => {
    const r = sec.getBoundingClientRect();
    if (!sec.classList.contains('is-in') && r.top < innerHeight * 0.5 && r.bottom > 0) {
      sec.classList.add('is-in');
      sec.dispatchEvent(new CustomEvent('v2:in'));
    }
    if (r.bottom < -50 || r.top > innerHeight + 50) return;
    const pos = toPos(progress());
    if (Math.abs(pos - last) < 1e-4) return;
    last = pos;
    stage.style.left = `${(-1440 * pos).toFixed(2)}px`;
    let current = 0;
    for (let k = 0; k < N; k++) {
      const d = k - pos; // >0: still to come, <0: left behind
      photos[k].style.transform = `translateX(${(clamp(d, -1, 1) * 260).toFixed(2)}px)`;
      const near = Math.abs(d);
      const o = clamp(1 - near * 3, 0, 1);
      copies[k].style.opacity = o.toFixed(3);
      copies[k].style.transform = `translateY(${(30 * clamp(near * 3, 0, 1)).toFixed(2)}px)`;
      copies[k].style.visibility = o > 0 ? '' : 'hidden';
      segs[k].style.opacity = clamp(1 - near, 0, 1).toFixed(3);
      if (near < 0.5) current = k;
    }
    labels.forEach((b, k) => b.setAttribute('aria-current', String(k === current)));
  };
  V2.onScroll(render);
  addEventListener('resize', () => { last = -1; render(); });

  // Labels jump to the matching slide.
  labels.forEach((b) => b.addEventListener('click', () => {
    const k = +b.dataset.go;
    const range = sec.offsetHeight - innerHeight;
    const p = k === 0 ? 0 : k === N - 1 ? 1 : (k + 0.5) / N;
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY + p * range, behavior: 'smooth' });
  }));
})();
