# Glass card

The surface that holds data: a live valuation, bids, checks, a receipt.

- **Figma:** ✲ Foundations › `Glass card` (335:261) · shown in Doc / 07b

## Properties

| Property | Type | Values / default |
|---|---|---|
| Style | Variant | Dark · White |

## Specs

| | |
|---|---|
| Dark | 360 wide · radius 26 · padding 24 · gap 16 · `surface/glass-light` + `line/hairline` + effect Glass / Card |
| White | radius 20 · `surface/card-white` + `line/divider-on-light` + effect Shadow / Light card |
| Content | Caption meta on top, a Number, then Data rows |

## Rules

1. Dark glass card in dark rooms; the White card only on Smoke.
2. Replace the rows with what the card holds; keep one key number per card.
3. Place cards beside devices or faces, never over a face.
4. Glass needs something behind it: a room light, a device or a photo.
5. Never detach to change the radius or shadow.

## In code

Known issue: the “+€38 vs. store price” pill in the component renders empty in Figma; fix pending.
