# LARISÉ Environment Strategy

## Environments

### Local development
- Copy `.env.example` to `.env.local`.
- Use the Supabase development project for local work.
- Never commit `.env.local` or any secret.
- Public Supabase values use the `NEXT_PUBLIC_` prefix.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to browser code.

### CI
- GitHub Actions runs lint, typecheck, unit tests, Playwright smoke tests, and production build.
- CI should receive Supabase public configuration through repository/environment secrets when a future test requires a live Supabase connection.
- CI must not print secret values to logs.

### Staging
- Staging should use a separate Supabase project from production.
- Apply database migrations through the repository migration workflow.
- Use staging-only credentials and storage buckets.
- Validate auth, RLS, invitation rendering, and core CRUD flows before production deployment.

### Production
- Production uses its own Supabase project and production-only credentials.
- Deploy only from the protected release path.
- Keep service-role credentials server-side only.
- Database changes must be reviewed and applied as migrations, not ad-hoc dashboard edits.

## Secret handling

- Commit only `.env.example`.
- Do not put secrets in `NEXT_PUBLIC_*` variables.
- Do not log access tokens, cookies, service-role keys, passwords, or private guest data.
- Rotate credentials if a secret is accidentally exposed.

## Phase 0 verification

The minimum foundation gate is:
1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run test:e2e`
5. `npm run build`
6. Auth redirect behavior verified manually.
7. RLS access verified with separate authenticated users.
