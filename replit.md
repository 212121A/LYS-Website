# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### ly-restaurant (React + Vite web app at `/`)
Restaurant website for **Ly Asiatische Spezialitäten** — Schwäbisch Gmünd.
- **Pages**: Home, Menu (`/menu`), Order (`/order`), About (`/about`), Contact (`/contact`), Careers (`/careers`)
- **Features**: Interactive order system with cart, full menu from real menu card, contact & application forms
- **Theme**: Accent color `#e8ebd6` (warm parchment), green primary (`#6b9a3d`), minimal anime aesthetic with Japanese kanji decorations, Playfair Display serif font
- **Logo**: `public/logo.png`
- **Menu data**: `src/data/menu.ts` — all dishes from the attached menu card

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
