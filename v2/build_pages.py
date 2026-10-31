"""Build the v2 subpages. Each page lives in pages/<slug>/:
  sections/*.html, js/*.js      -> v2/<slug>/index.html         (desktop, 1440 canvas)
  m/sections/*.html, m/js/*.js  -> v2/mobile/<slug>/index.html  (phones, 390 canvas)
Titles come from pages/<slug>/title.txt. Page scripts are inlined; assets use absolute /v2/... paths."""
import re
from pathlib import Path

root = Path(__file__).parent
menu = (root / "mobile" / "menu.html").read_text()


def build(src, shell, out, slug, title):
    parts = [p.read_text().strip() for p in sorted((src / "sections").glob("*.html"))]
    if not parts:
        return 0
    scripts = [f"<script>\n{p.read_text().strip()}\n</script>" for p in sorted((src / "js").glob("*.js"))]
    html = (shell.replace("{{SLUG}}", slug).replace("{{TITLE}}", title)
            .replace("<!--SECTIONS-->", "\n\n".join(parts)).replace("<!--SCRIPTS-->", "\n".join(scripts))
            .replace("<!--MENU-->", menu))
    html = re.sub(r"<img(?![^>]*\bdecoding=)", '<img decoding="async"', html)
    out.mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(html)
    return len(parts)


desk = (root / "page-shell.html").read_text()
mob = (root / "mobile" / "page-shell.html").read_text()
for page in sorted(p for p in (root / "pages").iterdir() if p.is_dir()):
    slug = page.name
    title = (page / "title.txt").read_text().strip() if (page / "title.txt").exists() else slug.title()
    n1 = build(page, desk, root / slug, slug, title)
    n2 = build(page / "m", mob, root / "mobile" / slug, slug, title)
    print(f"{slug}: desktop {n1} sections, mobile {n2} sections")
