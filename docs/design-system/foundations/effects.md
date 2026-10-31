# Effects

| Effect style | Recipe | Use |
|---|---|---|
| `Glass / Card` | Background blur 30 + shadow 0 30 60 black 50 % | Dark glass cards |
| `Glass / Chip` | Background blur 24 (20 on 32 px chips) | Chips |
| `Glass / Header` | Background blur 24 + shadow 0 16 40 black 35 % | Pinned header pill, mobile header |
| `Glass / Footer` | Background blur 30 + shadow 0 −20 60 black 45 % | Footer indigo card |
| `Shadow / Light card` | 0 24 60 Graphite 8 % | White cards in Smoke rooms |
| `Shadow / Device` | 0 30 60 black 45 % | Device photos and renders; match the device corner radius |

## Rules

1. Glass always pairs a fill (`surface/glass-*`), a 1 px `line/hairline` stroke and a Glass effect style.
2. Glass only works over something: a room light, a photo or a device. Don't put glass on flat Graphite with nothing behind it.
3. Shadows follow the shape: give the image rect the device's corner radius.
4. Never stack two effect styles on one layer.
