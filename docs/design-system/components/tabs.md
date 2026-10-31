# Tabs

Switches the view inside one room, for example the Intelligence chart.

- **Figma:** ✲ Foundations › `Tabs` (335:290 (Tab 335:289)) · shown in Doc / 07c

## Properties

| Property | Type | Values / default |
|---|---|---|
| Tab · Label | Text | Valuation |
| Tab · State | Variant | Default · Active |

## Specs

| | |
|---|---|
| Track | Tabs: glass track `surface/glass-light` · radius full · padding 4 · gap 4 · height 40 |
| Tab | Caption (13) · padding 8/14 · radius full |
| Active | Fill `accent/indigo` |

## Rules

1. Use four tabs at most; labels are single nouns.
2. Exactly one tab is active; switch it with the State property.
3. Tabs change content in place; never use them as page navigation.
