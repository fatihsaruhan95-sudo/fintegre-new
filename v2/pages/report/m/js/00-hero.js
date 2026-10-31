// Report hero: Share uses the native share sheet when there is one, else copies the link.
(() => {
  const btn = document.querySelector('[data-section="hero"] .rh-share');
  if (!btn) return;
  const label = btn.innerHTML;
  btn.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href.split('#')[0] };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      btn.textContent = 'Link copied';
    } catch (e) { if (e && e.name === 'AbortError') return; btn.textContent = 'Copy failed'; }
    setTimeout(() => { btn.innerHTML = label; }, 2000);
  });
})();
