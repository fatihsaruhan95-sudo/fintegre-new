# Building the site

How Figma rooms become code. The live site is `v2/`; the root `/` redirects there (`_redirects`). The old V1 files at the root stay hidden until they are removed.

## Structure

```
v2/
  shell.html, v2.css, v2.js        homepage shell, shared styles, runtime
  sections/NN-name.html, js/       homepage rooms (desktop, 1440 canvas)
  mobile/                          phone versions (390 canvas), shared menu.*
  pages/<slug>/                    subpages: sections/, js/, m/sections/, m/js/, title.txt
  page-shell.html                  subpage shell ({{TITLE}}, {{SLUG}})
  assets/                          images, absolute paths /v2/assets/...
```

Slugs: platform, solutions, intelligence, customers, case-study, insights, report, design-your-program, company.

## One room = one section file

Each Figma room `NN · Name` is one fragment `NN-name.html`:

```html
<section class="v2-sec" data-section="name" style="--h: 900px" data-tone="light"> <!-- data-tone only for Smoke rooms -->
  <div class="v2-canvas">
    <!-- absolute layout in 1440 × 900 design pixels, copied from Figma -->
  </div>
</section>
```

`v2.js` scales the canvas with `--s` (1440 wide on desktop, 390 on `html.m` phones), so use Figma pixel values directly. Phones (`innerWidth < 768`) are redirected to `/v2/mobile/...`.

## Motion

- `data-m="up|down|left|right|scale|pop|wipe"` + optional `style="--d: 300ms"` for entrances.
- `data-draw` + `pathLength="1"` on SVG paths for fibres.
- A room plays when it gets `.is-in` and receives the `v2:in` event; use `V2.onScroll(fn)` for scroll-driven rooms.
- Curves: `--ease`, `--spring`, `--inout` (see [Motion](foundations/motion.md)).

## Tokens

Brand colours exist as CSS variables in `v2/v2.css` (`--graphite`, `--indigo`, `--ice`, `--smoke`, `--titanium`). Every Figma variable carries its CSS name in Dev Mode (`var(--text-secondary)`, `var(--space-24)` …); add new ones to `:root` in `v2.css` with exactly that name instead of hard-coding a value.

## Build and run

```bash
python3 v2/build.py && python3 v2/mobile/build.py && python3 v2/build_pages.py
python3 -m http.server 5178
```

Then open http://localhost:5178/v2/. Commit the built `index.html` files; Netlify serves the repo as it is.

## Before you push

- No JS errors, no broken images, no horizontal overflow, no duplicate ids (desktop and mobile).
- Check one light room for the header's `on-light` style.
- Check with reduced motion on.
- Follow the [review checklist](checklist.md).
