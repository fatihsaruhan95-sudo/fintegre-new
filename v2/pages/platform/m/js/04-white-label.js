(function () {
  var sec = document.querySelector('[data-section="white-label"]');
  if (!sec) return;
  var row = sec.querySelector('.wl-row');
  var dots = [].slice.call(sec.querySelectorAll('.wl-pager button'));
  var slides = [].slice.call(sec.querySelectorAll('.wl-slide'));
  if (!row || !slides.length) return;
  function active() {
    var x = row.scrollLeft, best = 0, d = 1e9;
    slides.forEach(function (s, i) {
      var dd = Math.abs(s.offsetLeft - 20 - x);
      if (dd < d) { d = dd; best = i; }
    });
    if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 2) best = slides.length - 1;
    dots.forEach(function (b, i) { b.classList.toggle('on', i === best); b.setAttribute('aria-selected', i === best); });
  }
  var raf = 0;
  row.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; active(); }); }, { passive: true });
  dots.forEach(function (b, i) {
    b.addEventListener('click', function () { row.scrollTo({ left: slides[i].offsetLeft - 20, behavior: 'smooth' }); });
  });
  active();
})();
