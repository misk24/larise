# LARISÉ Architecture

> Status: baseline based on repository metadata and the current root structure. Confirm implementation details in code and migrations before relying on them for a change. This is not a substitute for schema inspection.

## 1. Technology stack

Verified from the root `package.json` and repository structure:
- Next.js 16, React 19, TypeScript.
- Tailwind CSS 4 and shadcn/ui-compatible component configuration.
- Supabase JS and `@supabase/ssr` for backend/auth integration.
- GSAP and Framer Motion are dependencies; use the existing convention in each area rather than mixing them casually.
- Vitest for unit/integration tests and Playwright for end-to-end tests.
- npm as the package manager, with `package-lock.json` committed.
- Node.js 22+ and npm 10+ as documented in README.

## 2. Repository map

Current root structure includes:
- `app/`: Next.js App Router routes and layouts.
- `components/`: shared and feature UI components.
- `config/`: application configuration.
- `docs/`: supporting documentation.
- `e2e/`: end-to-end test code.
- `hooks/`: reusable React hooks.
- `lib/`: shared utilities and service integrations.
- `styles/`: styling assets/configuration.
- `supabase/`: Supabase-related files and migrations/configuration.
- `tests/`: automated tests.
- `types/`: shared TypeScript types.
- `proxy.ts`: request/proxy-related behavior; inspect before modifying auth routing.

Do not assume every concern is confined to one directory. Follow imports and established patterns before placing code.

## 3. Application boundaries

- **Presentation:** route pages, layouts, and reusable components render UI and collect user input.
- **Domain/application logic:** shared modules and feature-level logic implement business rules and orchestrate operations.
- **Data access:** Supabase clients and queries access persisted data. Follow the existing server/client split and never import server-only credentials into client modules.
- **Authentication/authorization:** Supabase Auth identifies the user; server-side checks and database RLS enforce access. A UI redirect or hidden navigation item is not an authorization boundary.
- **Testing:** unit/integration tests validate isolated behavior; Playwright validates important user journeys.

These are logical boundaries. Preserve the codebase's current organization unless a scoped refactor is needed.

## 4. Supabase and security

- Use the project’s established server/browser Supabase client helpers. Locate them before creating alternatives.
- Treat all browser input and client-supplied role/profile values as untrusted.
- Enforce row access with RLS and perform privileged actions only in trusted server-side code.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or commit any real secret.
- Public environment variables may be exposed to the browser only when they are explicitly designed to be public (for example, the Supabase project URL and publishable/anon key).
- Avoid broad RLS policies. Test access as anonymous, normal user, and admin where applicable.
- Schema changes must include appropriate migrations and indexes where needed; do not make production-only manual database changes without recording them.

## 5. Authentication and routing

Product intent includes email/password and Google OAuth authentication, email verification, and role-aware admin/user areas. Confirm actual callback routes, middleware/proxy behavior, and redirect destinations in the current code before changing them.

- Keep authorization checks close to protected server operations.
- Avoid redirect loops between dashboard and admin routes.
- Do not trust a role supplied by a client form or URL.
- Preserve the current Next.js version's async route parameter conventions when working with dynamic routes.

## 6. Data model guidance

The product domain includes profiles, invitations, themes and theme sections, guests/RSVPs, wishes/messages, and potentially orders/settings/media. This is a domain inventory, not a guarantee that every table or field exists in the current database.

Before modifying data:
1. Inspect migrations and generated/shared types.
2. Identify foreign keys, uniqueness constraints, RLS policies, and triggers.
3. Consider existing rows and backward compatibility.
4. Add or update migration and tests.
5. Never guess schema columns from UI labels.

Theme definitions should remain reusable and separate from invitation-specific content where the current schema supports that model. Validate how section defaults and user overrides are merged before changing the builder or renderer.

## 7. External services and environment

- Local development uses `.env.local`; do not commit real environment files.
- GitHub Actions obtains required values from repository secrets or other configured secure environments.
- Keep environment variable names synchronized across README, CI, and application code.
- Fail clearly when required configuration is missing, without logging secret values.
- Never include credentials, tokens, service-role keys, or private user data in logs or test fixtures.

## 8. Quality checks

Root scripts currently include:
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:e2e`
- `npm run build`

Use the checks relevant to the change. CI configuration may require environment variables or services; report checks that could not run rather than implying they passed.

## 9. Architecture change rules

- Prefer the smallest change that satisfies the acceptance criteria.
- Reuse existing utilities, components, and Supabase clients.
- Avoid introducing a new library for behavior the current stack already supports.
- Document consequential changes to data models, auth boundaries, routing, or integrations in this file or an ADR under `docs/`.
- If code and documentation conflict, verify runtime behavior and update the documentation; do not blindly follow stale docs.
