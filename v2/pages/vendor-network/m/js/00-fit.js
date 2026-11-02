// Flow-laid sections ([data-fit]) take their height from their content, so longer copy, form errors or the
// success state never get clipped. The inline --h stays as the no-JS fallback.
(() => {
  const fit = () => document.querySelectorAll('.v2-sec[data-fit]').forEach((s) => {
    const flow = s.querySelector('[data-fit-flow]');
    if (flow) s.style.setProperty('--h', Math.ceil(flow.offsetHeight) + 'px');
  });
  fit();
  addEventListener('load', fit);
  addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  window.V2fit = fit;
})();
