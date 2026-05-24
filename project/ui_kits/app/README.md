# Ognicent — App UI Kit

A clickable recreation of the live PWA at three key surfaces. Mirrors the
React + Tailwind components in [`correngs-code/quanto-spendi`](https://github.com/correngs-code/quanto-spendi).

## Run it

Open `index.html` — it bundles React + Babel from a CDN and stitches the
components below into a phone-framed demo. A segmented switch in the top
toolbar flips between **Landing**, **Home**, and **Mese**.

## Files

| File | What it is |
|---|---|
| `index.html` | Demo host. Wires routing, sample state, success modal. |
| `data.js` | Categories, sample transactions, `guessIcon()` keyword map, `parseInput()` (the Italian Quick Add parser), EUR / date formatters. |
| `Icons.jsx` | Lucide-style SVG icons used in the product, exported as `OgWallet`, `OgHome`, `OgArrowUp`, etc. |
| `Buttons.jsx` | `CtaButton`, `PillButton`, `GhostButton`, `SaveButton`, `IconButton`. |
| `QuickAdd.jsx` | The pill-shaped input with live emoji-chip preview and Mic / Submit swap. |
| `BottomNav.jsx` | Three-tab glass nav (Home / Mese / Anno). |
| `ListRow.jsx` | Income (+) and expense (−) row variants. |
| `SuccessModal.jsx` | Auto-dismissing confirmation tinted by transaction kind. |
| `Landing.jsx` | Dark cinematic landing (compressed from `src/components/Landing.tsx`). |
| `HomeScreen.jsx` | Home from `src/routes/index.tsx` — greeting, hero amount, centered Quick Add. |
| `MeseScreen.jsx` | Month view from `src/routes/expenses.tsx` — saldo, category bars, lists. |
| `ios-frame.jsx` | Starter component — provides `<IOSDevice>`. |

## Behavior demoed

- Type a phrase in Quick Add — the chip emoji and accent color update live.
- Press the arrow → a tinted **success modal** flashes with the inferred emoji, name, and signed amount.
- The new transaction appears at the top of **Mese** with its category bar updating.
- Bottom nav syncs with the top toolbar segmented control.

## What this kit cuts

- Auth, Supabase, persistence — state lives in React only.
- Voice input — the Mic button is decorative; the parser still works on typed text.
- Edit-mode drag-and-drop on category tiles (lives in `CategoryTile.tsx` in the live app).
- Calendar / Anno screen — out of scope for the demo.
