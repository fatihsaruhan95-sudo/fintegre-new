# fintegre-new

The new Fintegre.com homepage as a static HTML build, converted from the Figma design (FTG New Flow, "Home — v3").

## Run it

Open `index.html` through any static server, for example:

```bash
python3 -m http.server 5178
```

Then visit http://localhost:5178.

## How it is built

- `sections/NN-*.html`: one fragment per homepage section (Tailwind utility classes, loaded from the Tailwind CDN).
- `shell.html`: page shell (head, floating header, droplet menu, tour dialog).
- `site.css`, `site.js`: layout scaling, header behaviour, sticky features, FAQ.
- `motion.css`, `motion.js`: per-section entrance motion, count-ups, parallax.
- `interact/*.js`: interactions per section group (program sheet, charts, estimator, booking, forms).
- `assets/`: images and icons exported from Figma.

After editing a section or the shell, rebuild `index.html`:

```bash
python3 build.py
```

## Notes

- From 1024px up, the 1440×900 design is scaled to the window; below 1024px the layout is fluid (tablet and mobile).
- Forms are front-end only; nothing is sent anywhere yet.
- Some copy and all charts/figures are example content and need review.
- Tailwind runs from the CDN Play script; compile it to static CSS before production.
