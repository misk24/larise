# LARISÉ

LARISÉ is an Indonesian digital wedding invitation platform built with Next.js, TypeScript, and Supabase.

## Requirements

- Node.js 22+
- npm 10+

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file named `.env.local` and add the environment variables required by the application and your Supabase project. Check the variable names referenced in the source code and GitHub Actions configuration; this repository does not include an `.env.example` template.

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

Read these documents in order:

1. `PRD.md`: approved product intent, requirements, acceptance criteria and scope boundaries.
2. `docs/STATUS.md`: concise current delivery status, open PRs, release risks and next priorities.
3. `Design_System.md`: visual direction, typography, color tokens and frontend/backend component boundaries.
4. `Architecture.md`: verified implementation boundaries, routes, auth/data guidance and architecture notes.
5. `Agents.md`: required Plan → Implement → Verify → Review workflow and rules for handling requirement mismatches.

The status document is updated as implementation is merged and verified. Do not use historical phase checklists as the current delivery tracker.
