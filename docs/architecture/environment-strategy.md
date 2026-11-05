# LARISÉ Environment Strategy

## Current repository setup

- Local development uses a developer-owned `.env.local` file.
- This repository currently does **not** contain an `.env.example` template. Do not instruct contributors to copy one.
- Determine required variable names from the current application source and GitHub Actions workflow. Keep this documentation synchronized when the environment contract changes.
- Never commit `.env.local`, production credentials, access tokens or other secrets.
- Public Supabase configuration may use `NEXT_PUBLIC_*` variables where required by the application.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to browser code or client bundles.

## CI

- GitHub Actions runs the repository's configured lint, typecheck, unit tests, Playwright E2E and production build checks.
- Supply any required values through GitHub Actions secrets/environment secrets.
- Do not print secret values to workflow logs.
- Keep checks that require external services explicit; a skipped or blocked check is not a pass.

## Staging

- Use a separate Supabase project from production when staging is provisioned.
- Apply database changes through reviewed, version-controlled migrations.
- Use staging-only credentials and storage configuration.
- Validate authentication, RLS, invitation rendering, media and core CRUD flows before production release.

## Production

- Use production-only credentials and storage configuration.
- Apply migrations through a coordinated release process.
- Verify migration history and actual database behavior; a migration file merged to GitHub is not proof it was applied.
- Keep service-role credentials server-side only.
- Maintain backup, recovery and rollback procedures before treating production readiness as complete.

## Environment verification

When changing environment configuration:

1. Inspect the current source and CI workflow for required variable names.
2. Update README and this document together.
3. Verify local startup and CI behavior where credentials/services are available.
4. Report any checks blocked by unavailable credentials or external services.
