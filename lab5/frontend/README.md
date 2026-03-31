# Warehouse Frontend

Frontend for Lab 5 of the educational project "Веб-система обліку складу".

## Stack

- Next.js
- TypeScript
- App Router

## Run

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.
Backend for integration is expected at `http://localhost:3001`.

## Architecture

- `src/app` — pages, routes and layouts
- `src/components` — reusable UI blocks
- `src/services/api` — future backend API layer
- `src/context` — future app-level state and providers
- `src/types` — shared TypeScript types
- `src/lib` — utilities and constants
