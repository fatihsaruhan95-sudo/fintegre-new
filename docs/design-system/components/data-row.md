# Data row

One line of data inside a card: a market and its bid, a check and its result.

- **Figma:** ✲ Foundations › `Data row` (334:275) · shown in Doc / 07b

## Properties

| Property | Type | Values / default |
|---|---|---|
| Label | Text | Lithuania |
| Value | Text | €598 |
| State | Variant | Default · Best |

## Specs

| | |
|---|---|
| Size | Stretches to the card width · height 30 · radius 10 · padding 0/12 |
| Text | Caption (13), label left, value right |
| Best | Fill `accent/indigo`, the winning row |

## Rules

1. Label left, value right; stretch to the card width.
2. One Best row per card at most.
3. Values are exact, with units: €598, 58 s, 91 %.
4. Use Baltic and Polish markets in examples.
