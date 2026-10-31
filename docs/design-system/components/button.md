# Button

The action. Primary is a Smoke pill with Graphite text; Secondary is a 1 px outline; Indigo sits inside cards and menus; Text link is a label with an arrow.

- **Figma:** ✲ Foundations › `Button` (334:250) · shown in Doc / 07a

## Properties

| Property | Type | Values / default |
|---|---|---|
| Label | Text | Design your program |
| Style | Variant | Primary · Secondary · Indigo · Text link |
| Size | Variant | M · S |

## Specs

| | |
|---|---|
| Size M | Text style Button (15) · padding 12/24 · gap 6 · radius full · height 46 |
| Size S | Text style Label (14) · padding 8/16 · height 38 · used in the header pill |
| Primary | Fill `brand/smoke`, text `text/on-light` |
| Secondary | No fill, 1 px `text/primary` stroke (Smoke 24 % on the site) |
| Indigo | Fill `accent/indigo`, white text |
| On Smoke rooms | Primary flips to a Graphite pill with Smoke text |

## Rules

1. One primary button per room.
2. Write labels as verbs, two to four words: Design your program, Talk to us, Get the report.
3. Use Indigo only inside a glass card, a menu or the footer, never as the room's main action.
4. Use Text link for secondary actions next to a primary button.
5. Never add icons other than the trailing arrow.
6. Never resize the pill by hand; let the label set the width.

## In code

`.v2-cta` in `v2/v2.css` (header). Room buttons are written per section; match the M spec above.
