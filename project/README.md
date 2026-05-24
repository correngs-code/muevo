# Ognicent — Design System

**Tieni traccia di ogni centesimo.**

Ognicent is an Italian personal-finance PWA — a mobile-first expense and income tracker. The product's promise is friction-free: open the app, tap an emoji category (or speak), type an amount, done. Everything in the design system flows from that promise — soft surfaces, generous tap targets, instant feedback, money rendered in tabular numerals at every scale.

This folder is the brand's design source-of-truth, in a portable shape. It contains tokens, type, color, components, sample slides, and a UI kit that mirrors the live product. Drop it next to a new mock, a marketing slide, or a campaign asset and the result will look like Ognicent.

---

## Source material

| Source | Where | Status |
|---|---|---|
| Product codebase (TanStack Start + React 19 + Tailwind v4 + shadcn) | [`correngs-code/quanto-spendi`](https://github.com/correngs-code/quanto-spendi) (private) | ✅ Read — tokens in `src/styles.css`; components in `src/components`; landing in `src/components/Landing.tsx`. The repo's directory name is the product's old codename (`quanto-spendi`); the live brand is **Ognicent**. |
| App icons / favicons | Imported into `assets/` from the repo's `public/` | ✅ |
| Web fonts | Inter, loaded from Google Fonts at runtime (the product does the same) | ✅ — no local TTF needed |
| Marketing / slide template | None provided | — |
| Figma | None provided | — |

Anyone iterating on this design system should read the live product code — `src/components/Landing.tsx`, `src/components/QuickAdd.tsx`, `src/components/CategoryTile.tsx`, `src/routes/expenses.tsx`, and the `:root` block in `src/styles.css` give the full visual + interaction story.

---

## What Ognicent is

| | |
|---|---|
| **Category** | Personal expense / income tracker (PWA) |
| **Market** | 🇮🇹 Italy — copy, currency, formatting, voice input all Italian-first |
| **Currency** | EUR, `it-IT` locale (`€ 1.247,80`) |
| **Platform** | Installable PWA, mobile-primary, desktop adapts to `max-w-xl` centered |
| **Auth** | Sign in with Google (one-tap), plus a generous "guest" mode |
| **Categories** | 12 default emoji categories — Spesa quotidiana 🛒, Cibo & Delivery 🍔, Trasporti ⛽, Casa & Bollette 🏠, Abbonamenti 📺, Salute & Fitness 💪, Shopping 🛍️, Tasse & Assicurazioni 📄, Tempo libero 🎉, Viaggi ✈️, AI & Tech 🤖, Altro ✨ |
| **Frequencies** | Una tantum / Settimanale / Mensile / Trimestrale / Annuale |
| **Voice input** | The Quick Add input speaks Italian — it understands `"pizza dodici"`, `"stipendio milleduecento"`, `"caffè uno virgola cinquanta"` and decides if it's an expense or income. |
| **Two visual modes** | A **light app surface** (cards, glass, soft shadow) and a **dark cinematic marketing surface** (deep navy + electric-blue glow) live side-by-side. They share the same blue and the same Inter type, but everything else flips. |

---

## Surfaces, by example

### 1. Light app (everyday) — `src/routes/index.tsx`, `expenses.tsx`, `months.tsx`

The hero of every screen is a single, oversized **amount** rendered in tabular numerals against a soft, near-white background. Cards are white with hairline borders and the two-layer card shadow. CTAs are pill-shaped with the vivid blue gradient and a colored glow. Category tiles are a grid of emojis on small glass chips. Movement is springy and short — `cubic-bezier(0.22, 1, 0.36, 1)`, 220–280 ms.

### 2. Dark marketing — `src/components/Landing.tsx`

Deep navy (`#05070d` → `#0b0f1a`) base. A radial glow of `rgba(59,108,255,…)` sits behind the hero. Headlines fade from white into the brand blue. The same emoji category grid that exists in the app is recreated as a floating phone mockup. The page reveals content on scroll with a single transition: `opacity + translateY(14px)` over 700 ms.

These are not separate brands — they're **the same brand in two moods**. The dark surface is opt-in: scope a container with `.landing-root` and the tokens reflow.

---

## Content Fundamentals

Ognicent's voice is **calm, second-person Italian** — short, warm, never preachy. It's the voice of a friend who happens to be very good with money.

### Language
- **Italian only.** No English mixed in except for proper nouns (Google, Netflix, Spotify, etc).
- **Tu**, never **Lei**. Imperatives are friendly, never bossy.
- **No filler.** Cut every word that doesn't earn its place.
- **No exclamation marks** in product copy. Confidence comes from clarity.

### Tone — examples lifted from the product

| Where | What it says |
|---|---|
| Tagline | *Tieni traccia di ogni centesimo* |
| Hero headline | *Sai davvero dove finiscono i tuoi soldi?* |
| Sub-headline | *Aggiungi spese ed entrate in pochi tap. Capisci subito quanto ti rimane davvero ogni mese.* |
| Primary CTA | *Inizia Gratis* |
| Secondary | *Hai già un account? Accedi* |
| App home eyebrow | *Buongiorno · ti rimangono* (greeting changes by time-of-day) |
| QuickAdd nudge | *Aggiungi un movimento e guarda la magia* |
| Empty state | *Nessuna spesa in questo mese.* |
| Positive saldo | *Ti rimangono questo mese* |
| Negative saldo | *Sei in rosso questo mese* |
| Trust strip | *Dati cifrati · Accesso con Google in un tap · Nessuna carta richiesta* |
| Success modal | *Spesa aggiunta* / *Entrata aggiunta* |
| Confirm-delete | *Sei sicuro di voler eliminare?* / *Sì* / *No* |
| Logout | *Esci dall'account · Vuoi davvero uscire? Potrai sempre rientrare con Google.* |

### Casing
- **Title Case for headlines on the dark surface** ("Inizia Gratis", "Tutto ciò che ti serve") — these are CTAs and feel like buttons.
- **Sentence case everywhere else** in-app — buttons, labels, dialog titles.
- **UPPERCASE eyebrows** with `letter-spacing: 0.14em` for section heads (CATEGORIE, SPESE, ENTRATE).
- Greetings start capitalized: *Buongiorno*, *Buon pomeriggio*, *Buonasera*, *Buonanotte*.

### Numbers & money
- **Always EUR**, **always `it-IT`**: `€ 1.247,80`. Decimal comma, thousands separator dot.
- **Sign prefixes**: `+€34,00` for income (success-green), `−€34,00` for expense (the literal minus glyph `−`, not a hyphen).
- **Tabular nums everywhere** money appears. `font-feature-settings: "tnum","ss01"`.

### Emoji
**Yes — emoji are core brand iconography**, not decoration. Twelve default emojis pin the twelve default categories; the `guessIcon()` function in `src/lib/expenses.ts` maps ~250 common Italian merchant/keyword strings to a specific emoji ("netflix" → 🍿, "ryanair" → ✈️, "esselunga" → 🛒). When in doubt, the fallback is ✨ ("Altro"). Emoji never appear in body copy or headlines.

### What we don't do
- ❌ No motivational personal-finance speak ("Crush your goals", "Master your money"). Calm, factual.
- ❌ No fear-based copy ("You're wasting money!"). The neutral "in rosso" is as harsh as we get.
- ❌ No personality emoji in copy (😊, 💸). Only category emoji, only in their category role.
- ❌ No marketing buzzwords (AI-powered, smart, intelligent). The product *is* smart; the copy doesn't say so.

---

## Visual Foundations

### Color

**Brand blue: `#3b6cff` (= `oklch(0.58 0.18 255)`).** Slightly violet, slightly electric. It carries every CTA and every focus ring.

| Token | Light app | Dark marketing |
|---|---|---|
| Surface | `oklch(0.975 0.003 250)` (~`#f5f6f9`) | `#05070d` |
| Card | `#ffffff` | `#0b0f1a` (with a `#10162a` top-gloss gradient) |
| Foreground | `oklch(0.20 0.015 265)` | `rgba(255,255,255,0.96)` |
| Muted text | `oklch(0.52 0.025 260)` | `rgba(255,255,255,0.62)` |
| Border | `oklch(0.92 0.01 250)` | `rgba(255,255,255,0.08)` |
| Primary | `oklch(0.58 0.18 255)` ≈ `#3b6cff` | `#3b6cff` (with `#5b8bff` highlight) |
| Success / income | `oklch(0.68 0.18 152)` | same — used as `+` accent |
| Destructive / negative saldo | `oklch(0.62 0.22 25)` | `#fca5a5` (lifted for dark BG) |

The brand uses **OKLCH as its authoring color space** so that lightness comparisons hold across hues. Don't author in HSL/RGB — convert if you have to.

### Type

- **Inter, exclusively** (400 / 500 / 600 / 700 / 800).
- **`tabular-nums`** wherever a number sits next to another number (amounts, percentages, dates, frequency-codes).
- **Tracking tight to extra-tight** on headlines (`-0.025em` to `-0.03em`). Body text default.
- **Eyebrow tracking 0.14em–0.20em**, uppercase, 11px, weight 600.
- Letter-spacing on amounts: `-0.02em` for medium, `-0.03em` for hero.

### Backgrounds

- **No photography in the product.** The app surface is a single soft vertical gradient (`--gradient-bg`); marketing layers two large radial glows of the brand blue (60% from center-top, 40% from upper-right) on a flat navy.
- **No patterns, no textures, no hand-drawn illustrations.** Decoration is purely color light — gradients, blurs, glows.
- **Full-bleed gradient CTAs** (the vivid blue 135° linear) carry the page's energy.

### Animation

The product has one signature easing curve: `cubic-bezier(0.22, 1, 0.36, 1)` — a soft overshoot-style "out" curve. Use it for ~95% of motion.

| Motion | Duration | Where |
|---|---|---|
| Hover lift on CTA | 150ms | `transform: translateY(-1px); filter: brightness(1.06)` |
| Press scale | 120–150ms | `active:scale-[0.96]` on tap targets; `scale-[0.99]` on big CTAs |
| Card enter | 280ms | `slide-up-fade` (opacity + 8px translateY) |
| Card leave | 180ms | `scale-fade-out` (collapses height + opacity) |
| Reveal on scroll | 700ms | `opacity 0→1, translateY 14px→0` (landing page only) |
| Pulse-glow | 2.4s loop | The "Aggiungi" CTA pulses subtly to invite the first tap |
| Edit-mode jiggle | 320ms loop | iOS-style ±1.4° rotation when category tiles enter edit mode |
| Splash pop | 520ms | Logo scales 0.6 → 1.06 → 1.0 then text fades up after 180ms delay |

**No bounces, no spring-overshoots over 1.08, no parallax.** When tiles drag (`framer-motion`), they `scale(1.08)` and the layout reflows with a `spring(stiffness:520, damping:38)`.

### Hover / press states

- **Hover** on light buttons: `bg-foreground/10` or `bg-secondary/60`. On colored CTAs: `filter: brightness(1.04–1.06)` and a `-1px` lift.
- **Press** on any tap target: `transform: scale(0.96)` (small) or `scale(0.99)` (big). Vibrate on mobile: `navigator.vibrate(8)` to `(12)`.
- **Focus** ring: a soft halo `0 0 0 4px oklch(0.58 0.18 255 / 0.08)` plus a `border-foreground/15`. Never a default browser outline.

### Borders, shadows, glass

**Three named card shadows** — never invent a fourth:

```css
--shadow-card:     0 1px 2px rgba(/* ink */ 0.03), 0 4px 16px -4px rgba(/* ink */ 0.06);
--shadow-elevated: 0 1px 3px rgba(/* ink */ 0.04), 0 12px 32px -8px rgba(/* ink */ 0.10);
--shadow-glow:     0 0 0 4px rgba(/* blue */ 0.08), 0 16px 36px -10px rgba(/* blue */ 0.28);
```

CTAs get `--shadow-cta`: a colored drop shadow tinted with the brand blue plus an inset `1px` highlight. The inset white edge is *essential* — it's what makes the buttons look raised.

**Glass utility** (`.glass`, `.glass-soft`): `backdrop-filter: blur(20–28px) saturate(180%)`, surface `color-mix(in oklab, var(--card) 70%, transparent)`, plus a 1px translucent border. Used for the bottom nav and the Quick Add input.

**Borders are always hairline** — `1px solid` with the border token. Two-pixel borders are reserved for the income highlight chip.

### Radii

| Use | Value |
|---|---|
| Hairline (input dot, mini pie center) | 4–6px |
| Default input | 12px (`rounded-xl`) |
| Card | 16px (`rounded-2xl`) |
| Category tile, Quick Add chip | 16–18px |
| Big card (hero amount, success modal, dialogs) | 24–28px (`rounded-3xl`) |
| Quick Add input shell | 26px |
| Bottom nav shell | 28px |
| Hero phone mockup | 36px (`rounded-[2.25rem]`) |
| All pills (CTAs, login, "Aggiungi") | `9999px` |

Cards stack: outer pill or 28px → inner 18–22px → tiles 16px. Roundness is a hierarchy signal.

### Transparency & blur

Used **only** to indicate elevation above another surface — bottom nav over content, success modal over the app, the dark-marketing nav over the hero glow. Never as decoration. When you blur, also `saturate(180%)` so the underlying color reads warmer.

### Imagery / illustration tone

There is no photography or illustration in Ognicent today. The product's only "image" is the wallet glyph in the splash and OS icon. If you need imagery in a slide or campaign, keep it **cool, blue-leaning, no warm or grainy filters**, and don't break the glass-and-glow aesthetic with photography.

### Layout

- **`max-w-xl` (36rem / 576px) centered** is the canonical content width on every screen.
- **`px-5` (20px) horizontal padding** on every screen edge.
- **Bottom nav is fixed** at `bottom-0`, three tabs (Home / Mese / Anno).
- **Safe-area padding** via `env(safe-area-inset-*)` everywhere edges touch screen edges.
- **Top of the home screen has no nav** — just brand wordmark + user avatar. The hero amount and Quick Add are everything.

### Density

Mobile, but never cramped. List items are `py-3` (12px) with a 40px avatar; cards are `p-5` to `p-6`. The hero amount eats half the screen on purpose — it is the screen.

### Don't

- ❌ Don't darken the brand blue toward navy when you need "more brand" — keep `#3b6cff` flat and add the glow shadow instead.
- ❌ Don't introduce a second accent color. Success green is *only* for income; destructive red is *only* for negative saldo and delete actions.
- ❌ Don't draw illustrations or icons by hand. Use Lucide for UI icons, emoji for categories.
- ❌ Don't use Material-style shadows or filled cards-with-colored-left-borders.
- ❌ Don't use the dark surface for app screens. The dark surface is marketing-only.

---

## Iconography

Ognicent's iconography is a **two-track system**:

### 1. UI icons → **Lucide React** (`lucide-react`)

Stroke icons, 1.8–2.2 stroke width, 14–20px in the product. Used for nav (`Home`, `Wallet`, `CalendarRange`), actions (`Plus`, `Pencil`, `Trash2`, `X`, `ArrowUp`, `ArrowRight`, `Mic`), and decorative micro-marks (`Sparkles`, `ShieldCheck`, `TrendingUp`/`Down`, `Bell`, `Eye`, `Zap`, `ChevronLeft`/`Right`, `LogOut`).

**Active vs idle weight matters**: nav icons use `strokeWidth={1.8}` when idle and `{2.2}` when active, plus a `scale(1.06)` transform. Action chevrons inside buttons use `{3}` to read as bold marks.

For prototypes, pull Lucide from CDN:
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="wallet"></i>
```
or use the React build (`lucide-react`) where available.

**No icon fonts, no sprites, no SVG sheets** ship in the product — Lucide's per-icon import is the only entry point.

### 2. Category icons → **Emoji**

Twelve canonical emojis pin the twelve categories (see Content Fundamentals). The `guessIcon()` function in `src/lib/expenses.ts` maps ~250 Italian merchant/keyword strings to specific emoji. **Emoji are first-class brand assets here** — when you mock a transaction list, use real merchant-driven emoji (`🍿` for Netflix, `⛽` for benzina, `🍕` for pizzeria) rather than the generic category default. The product's first impression is "look how cleverly it picked the right emoji" — preserve that.

Emojis render inside a glass chip — `.emoji-chip` in `src/styles.css` — which gives them a soft white pill with a radial highlight, so they look like a real button rather than raw Unicode.

### 3. Logo / app mark

The product mark is a **white wallet glyph (`Wallet` from Lucide) on a `#3b6cff` rounded square**, 8px–20px radius depending on size. Provided in `assets/`:

- `assets/ognicent-icon-512.png` — 512×512 master
- `assets/ognicent-icon-192.png` — 192×192 PWA
- `assets/ognicent-icon-96.png` — small thumbnail
- `assets/ognicent-icon-maskable-512.png` — Android maskable
- `assets/apple-touch-icon.png` — iOS home screen
- `assets/favicon-32.png`, `assets/favicon.ico` — browser

The wordmark is **plain Inter Semi-Bold (600), letter-spacing tight (~-0.01em)** — no custom typography, no marks alongside the type. Wordmark + glyph are typically locked-up horizontally with `gap: 8–10px`.

### 4. Unicode symbols

The product uses the literal `−` (U+2212 minus, not a hyphen) for negative amounts, `·` (U+00B7 middle dot) as a separator in trust strips, and `→` (rendered via Lucide `ArrowRight`) on CTAs. The `€` symbol is always the Unicode glyph, never `EUR`.

---

## Files in this folder

```
.
├── README.md                          ← you are here
├── SKILL.md                           ← agent / Claude Code skill entry
├── colors_and_type.css                ← all tokens as CSS custom properties
├── assets/                            ← logos, app icons, favicons
│   ├── ognicent-icon-512.png
│   ├── ognicent-icon-192.png
│   ├── ognicent-icon-96.png
│   ├── ognicent-icon-maskable-512.png
│   ├── apple-touch-icon.png
│   ├── favicon-32.png
│   └── favicon.ico
├── preview/                           ← Design System tab cards (one per concept)
│   └── *.html
└── ui_kits/
    └── app/                           ← hi-fi recreation of the Ognicent PWA
        ├── index.html                 ← clickable demo (Home → Mese flow)
        ├── README.md
        └── *.jsx                      ← component files
```

No slide template was provided, so no `slides/` folder ships.

---

## Caveats & substitutions

- **Inter is loaded from Google Fonts** — the product does the same. If you need offline assets, drop the Inter TTFs into `fonts/` and update the `@import` in `colors_and_type.css`.
- **No marketing decks were given.** Slide templates aren't included.
- **No Figma was provided.** The system was reconstructed from production code and is a faithful match to it.
- The repo's GitHub slug is `quanto-spendi` (the old codename); the live brand is **Ognicent**. Both names appear in the source for legitimate historical reasons.
