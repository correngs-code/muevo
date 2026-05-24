---
name: ognicent-design
description: Use this skill to generate well-branded interfaces and assets for Ognicent, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# Ognicent Design

Ognicent is an Italian personal-finance PWA — *Tieni traccia di ogni centesimo*. The product is mobile-first, calm, and emoji-driven. This skill lets you produce mocks, slides, marketing shots, or production-grade UI that match the live product pixel-for-pixel.

## Start here

1. **Read `README.md`** — full brand context, content fundamentals, visual foundations, iconography.
2. **Pull the tokens** — `colors_and_type.css` exposes every color, type, radius, shadow, and motion variable as a CSS custom property. Drop it into your `<head>` and you have the system.
3. **Skim the preview cards in `preview/`** — fastest way to see what "on-brand" looks like before you build.
4. **Crib from `ui_kits/app/`** — JSX recreations of every meaningful component. Don't reinvent; copy.

## Choosing a surface

Ognicent has **two visual moods**:

| Surface | When to use | How |
|---|---|---|
| **Light app** | App screens, in-product mocks, hi-fi product shots | Default — every token in `:root` resolves to the light surface. |
| **Dark cinematic** | Landing pages, marketing slides, hero shots, PR | Wrap the container with `class="landing-root"` and the tokens flip. |

Don't mix them on the same screen.

## Cardinal rules

- **Italian copy, second-person `tu`, no exclamation marks.** Calm, factual, never preachy.
- **Inter, exclusively** (400/500/600/700/800). `tabular-nums` on every money or numeric value.
- **One accent**: brand blue `#3b6cff` (`oklch(0.58 0.18 255)`). Green is *only* for income, red is *only* for negative saldo / delete.
- **Money formatting**: `it-IT` locale, `€ 1.247,80`, sign prefix `+` (green) / `−` U+2212 (foreground or red).
- **Iconography**: Lucide (stroke 1.8–2.2) for UI, emoji for category — they are first-class brand assets, not decoration.
- **Three named shadows only**: `--shadow-card`, `--shadow-elevated`, `--shadow-glow` (plus `--shadow-cta` for primary buttons).
- **Easing is always** `cubic-bezier(0.22, 1, 0.36, 1)` at 150–280ms. Hover lifts by `-1px` + `brightness(1.06)`. Press scales `0.96–0.99`.
- **Pills for primary CTAs** with the vivid blue gradient. 28px-rounded cards. Hairline 1px borders.
- **No photography, no hand-drawn illustrations, no Material shadows.** Decoration is light: gradients, glows, blur.

## Producing output

If asked for a **visual artifact** (slide / mock / throwaway prototype):
1. Create a self-contained HTML file with `colors_and_type.css` loaded.
2. Copy any needed assets from `assets/` (icons / favicons) into the artifact's folder — don't link cross-folder.
3. Lift components from `ui_kits/app/*.jsx` rather than rebuilding. They're plain React with inline styles, easy to drop into Babel-standalone setups.
4. Add a `<deck-stage>` if it's a presentation; otherwise size to the target device (mobile → `max-w-xl`).

If working on **production code**:
1. The live product uses TanStack Start + React 19 + Tailwind v4 + shadcn at [`correngs-code/quanto-spendi`](https://github.com/correngs-code/quanto-spendi). Match its file layout (`src/components/*`, `src/routes/*`, `src/lib/expenses.ts`).
2. Tokens already live in the product as `src/styles.css` — this skill's `colors_and_type.css` is a port. Edit there directly.
3. Keep voice / parser behavior consistent with `src/components/QuickAdd.tsx` — it's the heart of the product.

## When invoked without context

Ask the user:
1. **Surface** — light app screen, dark marketing, or a slide?
2. **Audience** — Italian end-user (default), investor deck, internal review?
3. **Scope** — single screen, full flow, or a one-shot asset?
4. **Variations?** — produce 2–3 options unless the ask is precise.
5. **Constraints** — pixel size, device target, accessibility needs?

Then act as an expert designer who outputs HTML artifacts OR production code, depending on the need. Default to HTML mocks unless told otherwise.

## File index

```
README.md                       brand context
colors_and_type.css             CSS variables — color, type, shadow, motion, radius
assets/                         logos + app icons + favicons
preview/                        Design System tab cards
ui_kits/app/                    JSX recreation of the live product
  ├── index.html                clickable demo (Landing / Home / Mese)
  ├── README.md                 component-by-component manifest
  ├── data.js                   categories, sample data, guessIcon, parseInput
  ├── Icons.jsx                 Lucide-style SVG icon set
  ├── Buttons.jsx               CTA / pill / ghost / save variants
  ├── QuickAdd.jsx              the iconic single-input
  ├── BottomNav.jsx             glass three-tab nav
  ├── ListRow.jsx               expense + income row
  ├── SuccessModal.jsx          auto-dismissing confirmation
  ├── Landing.jsx               dark cinematic marketing
  ├── HomeScreen.jsx            home (greeting + amount + Quick Add)
  └── MeseScreen.jsx            month (saldo + category bars + lists)
```
