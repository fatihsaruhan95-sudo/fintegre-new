# Fintegre design system

These files are the written rule set for designing and building Fintegre. Read them before you open the Figma file or touch the site code. They mirror the Figma file; when the two disagree, Figma wins and these files get updated.

- **Figma file:** [FTG New Flow](https://www.figma.com/design/4zGizg51U8J7LjLUq6pTsx) (`4zGizg51U8J7LjLUq6pTsx`)
- **Site:** this repository, deployed from `main` to Netlify (fintegre-new.netlify.app)
- **Version:** 1.0 · 31 Oct 2026

## Start here

1. [Working in Figma](figma-workflow.md): the page structure, how to start a new design, naming, what never to do.
2. [Foundations](foundations/): colours, gradients, typography, size and layout, effects, motion, icons, logo.
3. [Components](components/): one file per component with its properties, when to use it and its rules.
4. [Brand guidelines](guidelines/): the rule sets for positioning, imagery, connections, data, voice, social and accessibility.
5. [Building the site](development.md): how the Figma rooms become code in `v2/`.
6. [Review checklist](checklist.md): go through it before you hand a design over or open a pull request.

## The language in one paragraph

A page is a walk through quiet **rooms** (1440 × 900 on desktop, 390 wide on mobile), each holding one idea. Rooms are **Graphite** with a soft **Indigo** room light; one **Smoke** room every three or four for rhythm. Text is **Geologica** (Regular for headlines, Light for body), set tight, with at most one **Instrument Serif Italic** word per page. Data sits on **glass cards** and **chips**, joined to real Apple devices or people at work by thin **Ice fibres**. Motion explains what arrives and connects, plays once and rests.

## Index

| Area | Files |
|---|---|
| Foundations | [Colour](foundations/colour.md) · [Gradients](foundations/gradients.md) · [Typography](foundations/typography.md) · [Size & layout](foundations/size-and-layout.md) · [Effects](foundations/effects.md) · [Motion](foundations/motion.md) · [Icons](foundations/icons.md) · [Logo](foundations/logo.md) |
| Components | [Button](components/button.md) · [Chip](components/chip.md) · [Form field](components/form-field.md) · [Select chip](components/select-chip.md) · [Tabs](components/tabs.md) · [Pager](components/pager.md) · [Accordion item](components/accordion-item.md) · [Data row](components/data-row.md) · [Stat](components/stat.md) · [Glass card](components/glass-card.md) · [Node](components/node.md) · [Fibre](components/fibre.md) · [Header](components/header.md) · [Mobile menu](components/mobile-menu.md) · [Footer](components/footer.md) |
| Guidelines | [Brand essence](guidelines/brand-essence.md) · [Imagery: devices](guidelines/imagery-devices.md) · [Imagery: people](guidelines/imagery-people.md) · [Connections](guidelines/connections.md) · [Data & charts](guidelines/data-and-charts.md) · [Voice & copy](guidelines/voice-and-copy.md) · [Social media](guidelines/social-media.md) · [Accessibility](guidelines/accessibility.md) |

## Changing the system

1. Propose the change as a comment on the Figma frame, naming the rule and the reason.
2. The brand owner approves it and updates ✲ Foundations first.
3. Update the matching file here in the same pull request as any code change.
4. Log the change in Brand Guidelines › Doc 00 in Figma and raise the version on both sides.

Owner: _[name, role, e-mail]_ (to be filled in).
