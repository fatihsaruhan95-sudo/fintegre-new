"""Assemble v2/mobile/index.html from shell.html, the section fragments in sections/ and the scripts in js/."""
import re
from pathlib import Path

root = Path(__file__).parent
shell = (root / "shell.html").read_text()
parts = [p.read_text().strip() for p in sorted((root / "sections").glob("*.html"))]
scripts = [f'<script src="js/{p.name}"></script>' for p in sorted((root / "js").glob("*.js"))]
html = shell.replace("<!--SECTIONS-->", "\n\n".join(parts)).replace("<!--SCRIPTS-->", "\n".join(scripts)).replace("<!--MENU-->", (root / "menu.html").read_text())
html = re.sub(r"<img(?![^>]*\bdecoding=)", '<img decoding="async"', html)
(root / "index.html").write_text(html)
print(f"v2/mobile/index.html built from {len(parts)} sections, {len(scripts)} section scripts")
