# Header

The site navigation.

- **Figma:** ✲ Foundations › `Header` (336:288) · shown in Doc / 07c

## Properties

| Property | Type | Values / default |
|---|---|---|
| Type | Variant | Desktop · Pinned · Mobile |

## Specs

| | |
|---|---|
| Desktop | The top bar of the first room, at x 64, y 58, 1312 wide, no background |
| Pinned | 1312 × 64 glass pill, 20 from the top · `surface/glass-dark` + `line/hairline` + Glass / Header · padding 0/10/0/24 |
| Mobile | 350 × 64 pill, 20 from the edges, with a menu button |
| Links | Text style Label (14): Platform · Solutions · Intelligence · Customers · Insights · Company |
| CTA | Button Size S: Design your program |

## Rules

1. The Desktop type sits only in the first room; the Pinned header takes over after the hero.
2. On light rooms the pinned pill switches to light glass with Graphite text.
3. Never add more than six links.

## In code

`.v2-header` in `v2/v2.css`; shown after 80 % of the hero height by `v2/v2.js`, `on-light` over `data-tone="light"` sections.
