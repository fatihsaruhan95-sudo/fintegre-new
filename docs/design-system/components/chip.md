# Chip

A short fact pinned near a device or card: a check result, a market, a status.

- **Figma:** ✲ Foundations › `Chip` (334:264) · shown in Doc / 07a

## Properties

| Property | Type | Values / default |
|---|---|---|
| Label | Text | Screen · Grade A |
| Dot | Boolean | true |
| Style | Variant | Dark glass · Indigo · Light |

## Specs

| | |
|---|---|
| Size | Text style Label (14) · padding 10/16 · gap 8 · radius full · height 38 |
| Dark glass | Fill `surface/glass-dark` + effect Glass / Chip |
| Indigo | Fill `accent/indigo` (95 %), the highlighted one |
| Light | Fill `surface/card-white` + 1 px `line/divider-on-light`, for Smoke rooms |
| Dot | 7 px Ice dot (Node · Dot) |

## Rules

1. Borderless and fully rounded on dark; never add an outline to Dark glass.
2. One Indigo chip per group, for the fact that matters most.
3. Keep labels to one line: noun · value (Battery · 91 %).
4. Join chips to their device or card with a fibre, left to right.
5. Never use chips as buttons or navigation; use Tabs or Select chip.
6. No all-caps, no monospace.

## In code

Written per section as a rounded span with `backdrop-filter: blur(24px)` and `rgba(15,17,21,.55)`.
