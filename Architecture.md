# LARISÉ Architecture

> Status: implementation-oriented baseline checked against the current `main` source files and `package.json`. Database behavior must be verified against migrations and deployed schema before making operational claims.

## 1. Verified stack

- Next.js 16 App Router, React 19, and TypeScript.
- Tailwind CSS 4.
- Supabase Auth and database integration using `@supabase/supabase-js` and `@supabase/ssr`.
- Framer Motion and GSAP are dependencies; follow the established pattern in the relevant feature rather than combining them casually.
- Vitest for automated tests and Playwright for end-to-end tests.
- npm with a committed `package-lock.json`.

See `package.json` for current versions and scripts.

## 2. Repository layout

- `app/`: routes, pages, and layouts using the Next.js App Router.
- `components/`: shared and feature-specific UI.
- `lib/`: application actions, validation, and service integrations.
- `styles/`: global and scoped styling foundations.
- `supabase/`: Supabase configuration and database migrations.
- `tests/` and `e2e/`: automated test coverage.
- `types/`: shared TypeScript types.
- `proxy.ts`: request proxy behavior; inspect it before changing request/auth routing.

Follow imports and existing feature boundaries rather than assuming a concern lives in one directory only.

## 3. UI boundaries

- Brand-facing frontend and landing-page UI uses original, reusable LARISÉ components.
- Dashboard and admin application UI uses shadcn/ui-based components.
- `styles/frontend.css` scopes marketing/editorial typography: Rosehot display headings and Satoshi body text.
- `styles/backend.css` scopes dashboard/admin typography to Geist Sans and Geist Mono.
- Published invitation typography is controlled by the selected theme.

These boundaries are approved conventions, not proof that every existing screen is already compliant. Review the actual imports and CSS scope when auditing or changing a screen.

## 4. Application and data boundaries

- Route pages and components render UI and collect input.
- Server actions in `lib/actions/` orchestrate mutations and should validate inputs before writing.
- Supabase server/browser clients must follow the existing helpers in `lib/supabase/`.
- Use authenticated user identity and server-side ownership/role checks for protected operations.
- Database Row Level Security (RLS) is a separate enforcement layer; a hidden button or redirect is not authorization.
- Never import service-role credentials into client code or expose them in browser bundles.

## 5. Invitation flow verified in source

- Invitation creation and editing use a two-step flow: couple information, then theme selection.
- Slug and name order are established when a draft is created and remain locked in the edit UI. Full names and nicknames remain editable; changing a nickname does not regenerate the slug.
- Event date is edited through the builder's Event section; builder save logic also synchronizes it to the invitation-level `event_date` used by dashboard summaries.
- The current builder's configurable section order is defined in `components/dashboard/invitation-builder.tsx`. Its current public builder list contains ten section types: Cover, Opening, Quote, Couple, Event, Location, Gallery, RSVP, Gift, and Closing.
- RSVP and guest wishes are presented as a combined guest-facing flow according to the merged builder work.
- The section validation schema also recognizes a `countdown` type, but the current builder filters its editable section list to the ten types above. Product decision: countdown remains planned but is deferred to a later phase. Do not treat it as an acceptance criterion for the current phase or describe it as implemented. Reassess it when the deferred phase is planned.

This section records observable source behavior, not a guarantee that all migrations are applied to production or all paths have passed E2E tests.

## 6. Authentication and account security

- Auth flows are implemented in `lib/actions/auth.ts` and use Supabase Auth.
- Role checks and protected actions must be enforced server-side; inspect the current helpers before altering them.
- My Account includes profile management, Login & Security, and a Danger Zone UI.
- Password changes are restricted server-side to email/password accounts and re-authenticate with the current password.
- Account deletion is intentionally not implemented; the Danger Zone must not imply that deletion can currently be executed.

Verify relevant migrations, RLS policies, and provider behavior before changing authentication or account data.

## 7. Database and migrations

Before changing the schema:
1. Inspect current migrations and shared database types.
2. Check foreign keys, unique constraints, triggers, RLS policies, and existing records.
3. Make schema changes through a migration committed to the repository.
4. Add tests for affected authorization and data behavior where feasible.
5. Distinguish a migration present in a PR from a migration actually applied to the target database.

Do not claim a migration is deployed merely because it is merged.

## 8. Environment and quality checks

- Use local environment files for development; never commit real secrets.
- Keep environment variable names consistent between application code, README, and CI configuration.
- README setup should name required variables accurately. The repository's current `.env.example` file is absent, so do not instruct users to copy it unless it is restored.
- Available scripts include `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`.
- Report checks only when results are observed. Environment or service limitations must be stated explicitly.

## 9. Change rules

Prefer focused changes, reuse existing conventions, protect user data, and document consequential changes to routing, auth, data models, or integrations. If product intent and implementation disagree, preserve the requirement and request a decision rather than rewriting the requirement to match code.
