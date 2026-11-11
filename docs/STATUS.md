# LARISÉ Project Status

> Updated: 2026-11-12  
> Repository baseline: `main`  
> Product requirements: `PRD.md` and the approved LARISÉ PRD in Notion  
> This document is the concise delivery tracker. It does not replace product requirements or architecture documentation.

## Executive summary

The core invitation lifecycle is implemented: authentication, invitation creation, theme selection, section-based editing, shared rendering, image uploads, public invitations, guest responses, wishes, and dashboard management are present in the repository. Admin operations and the Theme Builder's section-level design configuration are also merged.

No pull requests are open. The dashboard integration and token-based guest security are deployed, and CI now covers database migrations and cross-user RLS behavior. The remaining risks are operational: production/staging separation, monitoring, backup/recovery and a documented release/rollback procedure.

## Completed and merged

| Area | Verified delivery |
| --- | --- |
| Foundation and security baseline | Next.js/TypeScript, Supabase clients, CI, tests, domain boundaries, schema/RLS verification and core database assertions. |
| Authentication and account | Email/password, Google OAuth, email verification, password reset, protected routes, profile editing, Login & Security, provider-aware password restrictions, Danger Zone UI. Account deletion remains disabled. |
| Invitation management | Create/edit wizard, theme selection, stable slug and name-order rules, draft lifecycle, duplicate/delete, event date managed in the builder. |
| Themes and renderer | Theme data/sections, shared section registry and renderer used by preview/public invitation. |
| Invitation builder | Section content editing, visibility/order, validation, save state, preview and publish controls. |
| Media | Supabase Storage image upload, validation, ownership checks, metadata, deletion handling and gallery integration. Advanced server-side optimization remains deferred. |
| Public invitation | Published-only public route at `/[slug]`, shared renderer, server rendering and share metadata. |
| Guest response | Guest, RSVP and wishes, now token-based (see Recently completed). |
| Dashboard and admin | Dashboard management baseline and integration (PR #53), admin overview/users/invitations, theme operations and shared backend components. PR #54 merged. |
| Theme Builder design configuration | Section-level background, typography, layout, buttons, images and decorative controls, validated configuration and real section renderer preview. PR #55 merged. |
| Backend visual system | Backend-scoped neutral/burgundy semantic palette with light/dark tokens. PR #56 merged. |

## Recently completed

- **Login/auth fixes (PR #61)**: case-insensitive email lookups, safe `next` redirect after Google login (non-admins can never be sent to `/admin`), cookie-less admin client, `revalidatePath` fix for wishes.
- **Database CI (PR #63)**: CI builds a throwaway Postgres from `supabase/ci` (Supabase stub, base tables, production grants) plus all migrations, then runs `supabase/tests` (pgTAP structure test and 36 cross-user/anon RLS and guest-RPC checks). Because no migration creates the base tables, `supabase/ci/01_base_schema.sql` mirrors production and must be kept in sync when tables change.
- **Landing UX audit (PRs #64, #65, #66, #67, #68)**: framer-motion honours reduced motion; faster one-time reveal animations; WCAG AA text contrast; public theme preview at `/tema/[slug]`; cached theme catalogue; login-aware navbar; canonical/OG/FAQ JSON-LD; optimized Supabase Storage thumbnails; an e2e test that every landing section and the footer become visible after scrolling (PR #67 fixed a regression that left the footer transparent).

- **PR #53 (dashboard management integration and token-based guest RSVP/wishes)** is merged and deployed to production. Both RSVP migrations are applied to the production Supabase project (`guest_rsvp_rpcs`, then `restrict_public_guest_writes`). Anonymous clients can no longer write guests, RSVPs or wishes directly; they use `submit_guest_rsvp`, `submit_guest_wish` and `resolve_public_guest` with the guest's private token. Each guest may leave at most 3 wishes. Personal links (`?guest=`) are `noindex` with a `same-origin` referrer policy. A first real RSVP and wish through the new flow was confirmed in production.
- PRs #52 (background music URL), #57 and #58 (theme-category palette cleanup) were closed without merge by the maintainer and are not planned.

Note: Supabase records applied migrations with its own timestamps, so the production version numbers differ from the file names in `supabase/migrations`. The two RSVP migration files are idempotent for this reason.

## Next work, in priority order

1. **Production verification.** Exercise real owner/admin accounts, public published/unpublished routes, media operations and dashboard counts against production. Known policy duplicates: production still has both "Owners manage ..." and "Users manage own ..." policies on `invitation_media` and `invitation_sections` (Supabase performance advisor: multiple permissive policies). Clean up with a migration verified by the RLS CI tests.
2. **Production readiness.** Staging/production separation (the `larise-staging` project is empty and migrations were never applied there; separation was deliberately deferred), `NEXT_PUBLIC_SITE_URL` set to the production domain, migration/release procedure, monitoring, backup/recovery, smoke tests and rollback procedure.
3. **Content and data gaps.** Active themes have no `thumbnail_url`/`preview_url`; landing cards show placeholders. Landing hero/collection headings are still in English. Convert the base tables to a migration so `supabase/ci` is no longer a hand-copied mirror.
4. **Hardening backlog.** Public interaction rate limiting (beyond the 3-wish cap), media cleanup/optimization gaps.

## Deferred product scope

These are not current blockers and must not be represented as implemented:

- Countdown section in the builder.
- Account deletion and platform settings persistence.
- Orders/payments, subscriptions and monetization.
- Video hosting, advanced audio hosting, CSV/Excel import and WhatsApp automation.
- Custom domains, collaboration, version history, advanced analytics/SEO and AI features.
- Timeless/no-expiration promise until storage and operating economics are validated.

Background music via a user-supplied URL (PR #52) was closed without merge and is not currently planned; the app is not an audio-hosting platform.

## Source-of-truth and status rules

- `PRD.md` records approved product intent and acceptance criteria.
- `Architecture.md` and `Design_System.md` record current technical and visual conventions.
- This file records delivery status as observed on the repository baseline and linked PRs.
- Notion's original Implementation Plan contains historical phase notes and has not kept pace with the repository after 2026-10-14. Treat its old phase checkboxes and PR states as historical, not current status.
- A PR is completed only after merge and verification. A migration is deployed only after application to, and verification against, the target database.
- If implementation and product intent disagree, record the gap and obtain a product decision. Never rewrite requirements merely to make the status look green.
