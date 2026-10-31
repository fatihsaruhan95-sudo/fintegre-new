# Colour

Graphite ground, indigo light: two primary colours and four that support them.

## Brand palette

| Variable | Hex | CSS | Share of a page | Use |
|---|---|---|---|---|
| `brand/graphite` | #0F1115 | `var(--graphite)` | 70 % | Ground of every dark room. Never pure black. |
| `brand/indigo` | #3047EC | `var(--indigo)` | 8 % | Room light, highlighted chip, best bid. A fill, never text on dark. |
| `brand/ice` | #B7D7FF | `var(--ice)` | 4 % | Fibres, dots, hairlines, focus rings. |
| `brand/smoke` | #F5F7FA | `var(--smoke)` | 12 % | Text on dark. Light rooms for rhythm. |
| `brand/titanium` | #A7B0BE | `var(--titanium)` | 5 % | Meta text, captions, axis labels. |
| `brand/deep-indigo` | #141E6E | `var(--deep-indigo)` | 1 % | Gradient depth, footer card, closing. |
| `brand/white` | #FFFFFF | `var(--white)` | — | Logo on dark, white cards. |

## Semantic tokens

Use these in designs; they alias the brand palette.

| Variable | Value | Use |
|---|---|---|
| `surface/ground` | → graphite | Dark room ground |
| `surface/light-room` | → smoke | Smoke room ground, one in every 3–4 rooms |
| `surface/glass-dark` | Graphite 55 % | Chips, pinned header pill (with Glass / Chip or Glass / Header) |
| `surface/glass-light` | White 7 % | Dark glass card fill (with Glass / Card) |
| `surface/card-white` | → white | White card in Smoke rooms |
| `surface/room` | #2236C4 | Centre of the room light gradients |
| `text/primary` | → smoke | Headlines and key text on dark |
| `text/secondary` | Smoke 68 % | Body copy on dark |
| `text/tertiary` | → titanium | Meta, captions, axis labels |
| `text/on-light` | → graphite | Headlines and icons on Smoke or white |
| `text/on-light-secondary` | Graphite 70 % | Body copy on Smoke or white |
| `line/hairline` | Ice 14 % | 1 px outline of glass cards and pills |
| `line/fibre` | Ice 55 % | Fibre curves, 1.2–1.5 px |
| `line/divider-on-light` | Graphite 8 % | Hairlines and row rules in light rooms |
| `accent/indigo` | → indigo | Highlighted chip, best bid row, links on Smoke |
| `accent/ice` | → ice | Chip dot, nodes, delta text |
| `state/error` | #D93F4C | Form validation only |
| `doc/band` | → ice | Figma page bands only, never on the site |
| `doc/alternative` | #FF7A1A | Bands on alternative explorations, never on the site |

## Rules

1. Use Graphite as the ground of dark rooms; never pure black.
2. Use Indigo as light: a glow, a highlighted chip, the best bid.
3. Never set Indigo text on Graphite (2.9 : 1).
4. Use Ice only for fibres, dots, hairlines and focus rings.
5. Add a Smoke room for rhythm; never two light rooms in a row.
6. Give each dark room one indigo room light, behind the subject.
7. Apply colour variables; never type hex values.
