# Holmes Income Forecast 2026

Next.js app for managing the Holmes Homes partnership-income forecast across all four 2026 developments (Oquirrh West, Towns on Main, Legacy/Sand Hollow, Alaia).

## Pages

- **Dashboard** (`/`) — all-development rollup with monthly Plan vs Actual on key metrics.
- **Forecasting Template** (`/forecast`) — edit the Plan column for any development across all 12 months. Totals, margins, and inventory balances recalculate automatically.
- **Actuals Input** (`/actuals`) — edit the Actual column. Jan–Apr are pre-filled from the source workbook; May–Dec are blank for manual entry as months close.
- **Settings** (`/settings`) — configure profit-share splits per development, rename developments, reset to seed data.
- **Export to Excel** (button in header) — generates an `.xlsx` snapshot of the current state.

## Conventions

- Expense line items (COGS, Soft Costs, Mgmt Fees, Warranty, Advertising, Model Home, Prof Services, Other G&A) are entered as positive numbers and stored as negative values, matching the source workbook.
- Inventory "Beg" balances are editable in the January column only; every subsequent month rolls forward automatically (Beg = prior month's End).
- All edits live in the browser's `localStorage` under the key `holmes-forecast-2026`. There is no backend yet — see "Persistence" below.

## Persistence

Currently the app uses **per-browser localStorage**. Each visitor sees the seed data on first load and can edit independently; no edits are shared. If you need a shared single source of truth across users, the next step is to wire a database (Vercel Postgres / Supabase / etc.).

## Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- Zustand (state + localStorage persistence)
- SheetJS (`xlsx`) for Excel export

## Deployment

Deployed on Vercel, linked to this repo. Pushes to `main` auto-deploy.
