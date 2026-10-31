# Accessibility & contrast

Every reader must be able to read the text, reach the controls and stop the motion.

## Rules

1. Keep body text at 4.5 : 1 or more; large text (24 px+) at 3 : 1 or more.
2. Never use Indigo text on Graphite or Titanium text on Smoke.
3. Use at least 13 px for captions, 16 px for body on mobile, 17 px on desktop.
4. Make tap targets at least 44 × 44 px and show an Ice focus ring.
5. Honour “reduce motion”: show the final state, no movement.
6. Give every meaningful image alt text; mark decorative images as such.
7. Never use colour alone to carry meaning; add a label or icon.

## Specs

| | |
|---|---|
| Standard | WCAG 2.2 level AA |
| Pairs that pass | Smoke on Graphite 17.6 · Ice on Graphite 12.8 · Titanium on Graphite 8.6 · White on Indigo 6.5 · Graphite on Smoke 17.6 · Indigo on Smoke 6.0 |
| Pairs that fail | Indigo on Graphite 2.9 · Titanium on Smoke 2.0 (never for text) |
| Focus | 2 px Ice ring, 2 px offset |
| Reduced motion | prefers-reduced-motion: skip entrances and fibre draws; keep 200 ms fades |
| Video | No autoplay with sound; captions on all spoken content |
