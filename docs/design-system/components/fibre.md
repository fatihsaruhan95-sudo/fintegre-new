# Fibre

A thin Ice curve that carries data from the check to the device to the value.

- **Figma:** ✲ Foundations › `Fibre` (334:295) · shown in Doc / 07b

## Specs

| | |
|---|---|
| Stroke | 1.4 px (1.2–1.5) · `line/fibre` (Ice 55 %); active may rise to 75 % |
| Curve | Both control points at the horizontal midpoint |
| Ends | Round caps, a Node at each end |
| Motion | PATH_TRIM_END 0 → 1 · `cubic-bezier(.65,0,.25,1)` · 0.8–1.0 s |

## Rules

1. Resize the instance to span from chip to device or card; flip it as needed.
2. Connect left to right: the check, the part of the device, the card.
3. Never add arrowheads; never cross or tangle fibres.
4. Keep them few and calm: three to five per room.

## In code

SVG `path` with `pathLength="1"` and `data-draw`.
