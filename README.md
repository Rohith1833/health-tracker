# Health & Routine Tracker

Mobile-first PWA monorepo for a production-grade health and routine tracking application.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, ShadCN/UI
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma ORM
- Authentication: Supabase Auth with Google login

## Workspace

```text
apps/
  web/      React + Vite frontend
  api/      Express + TypeScript backend
packages/
  shared/   Shared constants, schemas, types, and utilities
docs/       Project documentation
```

## Scripts

```text
npm install
npm run dev
npm run build
npm run lint
npm run format
npm run typecheck
```

## Environment

Copy each example file before running locally:

```text
apps/web/.env.example -> apps/web/.env
apps/api/.env.example -> apps/api/.env
```

No business logic is implemented in this setup. The repository contains the application foundation only.
