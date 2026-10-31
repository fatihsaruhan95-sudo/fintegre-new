# Size & layout

A page is a walk through quiet rooms, each holding one idea.

## Spacing (`Size › spacing/*`, scope: gap)

4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 120 — CSS `var(--space-N)`.

## Radius (`Size › radius/*`)

| Token | Value | Use |
|---|---|---|
| `radius/8` | 8 | Small inner elements, bars |
| `radius/12` | 12 | Form fields, select chips |
| `radius/16` | 16 | Small cards, accordion items |
| `radius/26` | 26 | Glass cards |
| `radius/full` | 999 | Chips, buttons, header pill |

## Layout (`Size › layout/*`)

| Token | Value |
|---|---|
| `layout/room-width` | 1440 |
| `layout/room-height` | 900 |
| `layout/margin-desktop` | 120 |
| `layout/mobile-width` | 390 |
| `layout/margin-mobile` | 20 |

Desktop room: 1440 × 900, 120 margins, 1200 content area. Top bar at x 64, y 58. Text sits in the left half, no wider than 560 px; the visual takes the right half and may bleed off the edge.

Mobile: 390 wide, 20 margins, tap targets ≥ 44 × 44. Swipe rows: cards 300 wide, gap 16, first card at x 20, the next card peeks.

## Rules

1. Give each room one idea: one headline, one paragraph, one visual.
2. Build desktop rooms at 1440 × 900; grow taller only when content needs it.
3. Keep 120 px side margins; only visuals may bleed off the edge.
4. Keep text in the left half, no wider than 560 px.
5. Alternate visual and text rooms; never two light rooms in a row.
6. On mobile, stack text first, then the visual.
7. Turn card rows into swipe rows on mobile; let the next card peek.
8. Bind gaps, padding and radii to the Size variables.
