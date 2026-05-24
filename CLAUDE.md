# Muevo — Contesto progetto

Tracker spese personali in italiano. UI mobile-first, dark mode. Stack: React 18 + Vite 5 + TypeScript (strict) + Supabase.

## URL di produzione

- **Vercel (principale):** https://mueve-eight.vercel.app/ — auto-deploy ad ogni push su `main`
- **GitHub Pages:** https://correngs-code.github.io/muevo/ — deploy manuale con `bash deploy-pages.sh`
- **Repo:** https://github.com/correngs-code/muevo

## Architettura

```
src/
  App.tsx              # Root: routing, stato globale, demo mode, auth
  components/
    Landing.tsx        # Schermata iniziale (non loggato)
    HomeScreen.tsx     # Saldo mese + QuickAdd
    MeseScreen.tsx     # Lista transazioni mese corrente + categorie
    AnnoScreen.tsx     # Griglia calendario 3×4 + bottom sheet per mese
    BottomNav.tsx      # Nav bar fissa in basso (Home / Mese / Anno)
    QuickAdd.tsx       # Form aggiunta rapida entrata/uscita
    ListRow.tsx        # Riga singola transazione (con swipe-to-delete)
    SuccessModal.tsx   # Modale animata dopo aggiunta
    Buttons.tsx        # Componenti bottone riusabili
    Icons.tsx          # SVG icons inline
    expenses.ts        # guessIcon(), formatEUR(), categorie, colori
  lib/
    supabase.ts        # Client Supabase, tipi, CRUD (fetchTransactions, addTransaction, deleteTransaction)
  styles/
    tokens.css         # Design tokens OKLCH, font Inter, animazioni
  main.tsx
```

## Modalità demo

Quando `VITE_SUPABASE_URL` non è configurato, l'app entra in demo mode:
- Nessun login richiesto
- Dati salvati in `localStorage` (`muevo_demo_txs`)
- Si parte da sezioni **vuote** (nessun seed)
- Banner blu in cima: "Modalità demo · i dati sono salvati localmente"

## Supabase

- Auth: Google OAuth (`signInWithGoogle` → redirect)
- Tabella: `transactions` con RLS (user vede solo le proprie)
- Schema: `id, user_id, name, amount, kind (income|expense), category, icon, created_at`
- `fetchTransactions` recupera tutto l'anno corrente, ordinato per data desc

## Design system

- Font: Inter (Google Fonts)
- Colori: OKLCH custom properties (`--foreground`, `--background`, `--muted-foreground`, ecc.)
- Tema: dark by default
- Animazioni: `fadeIn`, `scaleIn`, `slideUp` definiti in `tokens.css`
- Accent principale: `oklch(0.62 0.22 260)` (blu-viola)

## Schermata Anno

Griglia 3×4 (Outlook-style):
- Mese corrente: bordo blu + badge "Ora"
- Mesi con dati: card bianca con ombra, dot spese (pillole blu), saldo netto, totale spese
- Mesi vuoti: bordo tratteggiato
- Tap su mese → bottom sheet animato (slide up) con: saldo, riepilogo entrate/spese, barre categorie, lista movimenti

## Categorie

Definite in `src/components/expenses.ts`:
Cibo & Delivery, Spesa quotidiana, Trasporti, Casa & Bollette, Abbonamenti, Shopping, Salute & Fitness, Viaggi, Tasse & Assicurazioni, Altro

## Regole importanti

- **MAI hardcodare token GitHub** (`ghp_...`) in file tracciati — usare `$GITHUB_TOKEN`
- **Git commit**: usare sempre `-c gpg.format=openpgp -c commit.gpgsign=false` (server di firma richiede campo `source`)
- **vite.config.ts**: `base: '/muevo/'` per GitHub Pages (non rimuovere)
- **Push**: `git push -u origin main` per triggerare Vercel

## Deploy

```bash
# GitHub Pages (manuale)
bash deploy-pages.sh

# Vercel (automatico)
git push -u origin main   # Vercel si aggiorna da solo
```

## Funzionalità da implementare / migliorare

Aggiorna questa sezione man mano che si lavora sul progetto:
- [ ] Categoria selezionabile durante l'aggiunta (non solo auto-detect)
- [ ] Edit di una transazione esistente
- [ ] Budget mensile con progress bar
- [ ] Export CSV
