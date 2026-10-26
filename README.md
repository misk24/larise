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

Create a local environment file named `.env.local` and add the environment variables required by the application and your Supabase project. Check the variable names referenced in the source code and GitHub Actions configuration; this repository currently does not include an `.env.example` template.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit real secrets.

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

Some checks may require local environment variables or configured external services. Report blocked checks rather than treating them as passing.

## Project Documentation

- `PRD.md`: approved product intent and requirements.
- `Design_System.md`: visual direction, typography, and frontend/backend component boundaries.
- `Architecture.md`: verified implementation boundaries, auth/data guidance, and architecture notes.
- `Agents.md`: required Plan → Implement → Verify → Review workflow and rules for handling requirement mismatches.
