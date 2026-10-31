# Accordion item

A question and answer in the FAQ room (a light Smoke room).

- **Figma:** ✲ Foundations › `Accordion item` (335:279) · shown in Doc / 07b

## Properties

| Property | Type | Values / default |
|---|---|---|
| Question | Text | Is Fintegre a consumer trade-in site? |
| Answer | Text | No. Fintegre is B2B and white-label… |
| State | Variant | Closed · Open |

## Specs

| | |
|---|---|
| Size | 820 wide · radius 16 · padding 20/24 · gap 8 |
| Fill | `surface/card-white` on Smoke |
| Question | Text style Button (15) |
| Answer | 14 Regular, `text/on-light-secondary` |

## Rules

1. Stack items with a 10 px gap in a column 820 wide.
2. Open one item at a time.
3. Write questions the way a partner would ask them; answer in two or three sentences.
4. Use only in light rooms.

## In code

FAQ section in `v2/sections/12-faq.html`.
