# Form field

One labelled input in contact and newsletter forms.

- **Figma:** ✲ Foundations › `Form field` (335:320) · shown in Doc / 07a

## Properties

| Property | Type | Values / default |
|---|---|---|
| Label | Text | Work email |
| Value | Text | name@company.com |
| State | Variant | Default · Focus · Error |

## Specs

| | |
|---|---|
| Layout | Label above the input, gap 8, 360 wide |
| Label | Text style Label (14) |
| Input | Text 15 · radius 12 · glass fill with 1 px hairline |
| Focus | 2 px Ice ring |
| Error | `state/error` stroke and a 12 px message under the input (Enter a work email) |

## Rules

1. Always show a visible label; never use the placeholder as the label.
2. Ask for work details only: work email, company, market.
3. Write error messages as an instruction: Enter a work email.
4. Use `state/error` only for validation.
5. Keep forms to one column on mobile, full width minus 20 px margins.

## In code

Forms on the site are front-end only; nothing is sent yet.
