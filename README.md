# LARISÉ

LARISÉ is a digital wedding invitation platform built with Next.js, TypeScript, and Supabase.

## Requirements
- Node.js 22+
- npm 10+

## Getting Started

Install dependencies:
```bash
npm install
```

Copy the environment template:
```bash
cp .env.example .env.local
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit secrets.

Run the development server:
```bash
npm run dev
```

Open http://localhost:3000.

## Quality Checks
```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Environment
Required variables are documented in `.env.example`.
