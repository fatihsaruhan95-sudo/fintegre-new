"""Assemble index.html from shell.html, the section fragments in sections/ and the scripts in interact/."""
import re
from pathlib import Path

root = Path(__file__).parent
shell = (root / "shell.html").read_text()
parts = [p.read_text().strip() for p in sorted((root / "sections").glob("*.html"))]
scripts = [f'<script src="interact/{p.name}"></script>' for p in sorted((root / "interact").glob("*.js")) if p.name != "shell.js"]
html = shell.replace("<!--SECTIONS-->", "\n\n".join(parts)).replace("<!--INTERACT-->", "\n".join(scripts))
# Decode images off the main thread so they never stall a scroll frame.
html = re.sub(r"<img(?![^>]*\bdecoding=)", '<img decoding="async"', html)
(root / "index.html").write_text(html)
print(f"index.html built from {len(parts)} sections, {len(scripts)} section scripts")
