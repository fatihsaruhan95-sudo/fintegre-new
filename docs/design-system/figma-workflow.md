# Working in Figma

How the Figma file is organised, how to start new work and what to watch out for.

## Page structure

Pages run top to bottom in this order. `---` pages are separators.

| Page | What lives there | You may |
|---|---|---|
| → · Start here | Clickable index of every frame in the file | Navigate. Update the index when you add a flow. |
| ⦿ · Cover | File cover, used as the thumbnail | Update the status line. |
| ✢ · Brand Book | The brand presentation (72 slides) and Brand Guidelines (16 rule-set frames, below it) | Read. Propose changes with comments. |
| ✲ · Foundations | The design system: variables, styles, components, icons, logo, and the doc frames 00–09 | Read and place instances. Only the brand owner edits it. |
| ✲ · Website | Divider for the site flows | — |
| ❖ Home … ❖ Company | One page per flow, with ↳ sub-flows (Case study, Report) | Design here. |
| ❖ Alternatives | Explorations that are not approved yet | Put alternatives here, never over approved designs. |
| ✲ · Archive | Earlier versions, legacy components, removed slides | Reference only. Never build from it, never delete from it. |

## Anatomy of a flow page

Each flow page reads left to right:

1. **Cover · <Flow>**: a light typographic cover with an Ice accent strip, a status chip and the section count. No device imagery on covers.
2. **Bands**: an Ice (`doc/band`) band above each frame says what the frame is (`Desktop · 1440`, `Mobile · 390`).
3. **Desktop frame** (1440 wide, vertical auto-layout, gap 0) with sections named `NN · Name`, then the **mobile frame** (390 wide) 200 px to its right.

All pages use the canvas background `#1D2128`.

## Starting a new design

1. Duplicate an existing flow page so you get the cover, bands and frame setup.
2. Clone the **Header** (Type = Desktop) into the first room at x 64, y 58.
3. Build each room as a 1440 × 900 frame (taller only when the content needs it). Name it `NN · Name`.
4. Place components as **instances** from ✲ Foundations. Fill text through component properties.
5. Apply **colour variables**, **text styles** and **effect styles**. Never type a hex value, a font size or a shadow by hand.
6. End the page with the closing room and the **Footer**.
7. Build the mobile frame next to it: text first, then the visual; card rows become swipe rows.
8. Add the new frames to the → · Start here index.

## Alternatives

- Never edit an approved design to try an idea. Duplicate the section to ❖ Alternatives.
- Mark alternatives with an orange band (`doc/alternative`, #FF7A1A) at the top right, saying what changed.
- Desktop first; build mobile only once an alternative is chosen.
- When one is chosen, move it into the flow, then move the rest to ✲ Archive.

## Naming

| Thing | Pattern | Example |
|---|---|---|
| Room / section | `NN · Name` | `04 · Ecosystem` |
| Flow page | `❖ Name`, sub-flow `↳ Name` | `↳ Case study` |
| Doc frame | `Doc / NN Name` | `Doc / 03 Typography` |
| Component | `Name`, families `Group / Name` | `Icon / arrow-right` |
| Variant | `Property=Value` | `Style=Primary, Size=M` |
| Placeholder image | `Image · replace me` | — |

No colourful emojis in page names; use the line symbols already in the file (⦿ ✢ ✲ ❖ ↳ →).

## Imagery in Figma

- Reuse existing image fills by image hash; don't paste the same photo twice.
- Device PNGs: scale mode **Fit**, frame at the image's aspect ratio, effect style **Shadow / Device** with the device's corner radius.
- Photos on black: blend mode **Lighten**, cropped off the frame edge.
- The 3D Fintegre mark image is stored mirrored; flip the node so the top bar is on the right, like the flat logo.
- Each page uses its own device model and colour. iPads upright only.

## Motion in Figma

Keyframe descendants, never the top-level frame. Use the three curves from [Motion](foundations/motion.md), keep a room's timeline within 10 s and leave the resting state complete (the screenshot shows the resting state).

## Never

- Detach a Foundations component or restyle an instance's colours, radii or shadows.
- Create local colours, text styles or effects outside ✲ Foundations.
- Edit ✢ Brand Book, ✲ Foundations or ✲ Archive without approval.
- Use monospace fonts, all-caps eyebrow labels, drawn phones, AI-looking illustrations or stock people looking into the lens.
- Use real customer brand names or Apple logos.
- Put two light rooms in a row.

## Handing over

Run through the [review checklist](checklist.md), leave a comment on the flow cover with what changed, and tag the brand owner.
