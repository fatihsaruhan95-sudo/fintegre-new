# Motion

Motion explains; it never decorates. A room plays once, then rests.

## Curves

| Name | Curve | Duration | What |
|---|---|---|---|
| Entrance | `cubic-bezier(.16, 1, .3, 1)` | 0.8–1.2 s | Text and cards fade in and rise 30–90 px |
| Spring pop | `cubic-bezier(.3, 1.45, .5, 1)` | 0.6–0.8 s | Chips and nodes scale .6 → 1 with a small overshoot |
| Fibre draw | `cubic-bezier(.65, 0, .25, 1)` | 0.8–1.0 s | Fibres draw on (path trim 0 → 1), slow at both ends |

CSS: `--ease`, `--spring`, `--inout` in `v2/v2.css`. Durations: `Size › duration/200, 500, 800, 1200` (ms).

Stagger: headline lines 0.12 s · chips 0.2 s · fibres 0.4 s. Counters crossfade between values.

## Rules

1. Animate only to explain: what arrives, what connects, what changes.
2. Play each room once; never loop.
3. Bring text and cards in with a fade and a 30–90 px rise.
4. Pop chips and nodes with a small spring overshoot.
5. Draw fibres on, slow at both ends.
6. Show one thing at a time: headline, body, card, chips, fibres.
7. Keep a room's motion within 10 seconds, then let it rest.
8. Honour reduced motion: show the final state.

## In Figma

Keyframe descendants (never the top-level frame) with `OPACITY`, `TRANSLATION_X/Y`, `SCALE_XY`, `PATH_TRIM_END`. Keep the resting state complete.

## In code

Add `data-m="up|down|left|right|scale|pop|wipe"` and an optional `style="--d: 300ms"` delay; SVG paths that draw get `pathLength="1"` and `data-draw`. The room plays when it gets `.is-in` (see [Building the site](../development.md)).
