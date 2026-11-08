# LARISÉ Project Status

> Updated: 2026-11-08  
> Repository baseline: `main` (local branch `feat/dashboard-integration-rebased` includes pending work)  
> Product requirements: `PRD.md` and the approved LARISÉ PRD in Notion  
> This document is the concise delivery tracker. It does not replace product requirements or architecture documentation.

## Executive summary

The core invitation lifecycle is implemented: authentication, invitation creation, theme selection, section-based editing, shared rendering, image uploads, public invitations, guest responses, wishes, and dashboard management are present in the repository. Admin operations and the Theme Builder's section-level design configuration are also merged.

The dashboard integration from PR #53, background music from PR #52, and the dashboard palette cleanup from PR #58 have been re-applied locally on `feat/dashboard-integration-rebased`. They are **not merged, pushed, or deployed**, and the target database has not received the RSVP token migration. The most important release risk is now ordering: the phase-1 migration and the token-based client must be live before the phase-2 lock migration is applied, otherwise guests on the previous app version lose RSVP/wish submission.

## Completed and merged

| Area                               | Verified delivery                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation and security baseline   | Next.js/TypeScript, Supabase clients, CI, tests, domain boundaries, schema/RLS verification and core database assertions.                                                                                       |
| Authentication and account         | Email/password, Google OAuth, email verification, password reset, protected routes, profile editing, Login & Security, provider-aware password restrictions, Danger Zone UI. Account deletion remains disabled. |
| Invitation management              | Create/edit wizard, theme selection, stable slug and name-order rules, draft lifecycle, duplicate/delete, event date managed in the builder.                                                                    |
| Themes and renderer                | Theme data/sections, shared section registry and renderer used by preview/public invitation.                                                                                                                    |
| Invitation builder                 | Section content editing, visibility/order, validation, save state, preview and publish controls.                                                                                                                |
| Media                              | Supabase Storage image upload, validation, ownership checks, metadata, deletion handling and gallery integration. Advanced server-side optimization remains deferred.                                           |
| Public invitation                  | Published-only public route at `/undangan/[slug]`, shared renderer, server rendering and share metadata.                                                                                                        |
| Guest response foundation          | Earlier merged guest, RSVP and wishes baseline. Token-only public submission is part of the pending local branch below.                                                                                        |
| Dashboard and admin                | Dashboard management baseline, admin overview/users/invitations, theme operations and shared backend components. PR #54 merged.                                                                                 |
| Theme Builder design configuration | Section-level background, typography, layout, buttons, images and decorative controls, validated configuration and real section renderer preview. PR #55 merged.                                                |
| Backend visual system              | Backend-scoped neutral/burgundy semantic palette with light/dark tokens. PR #56 merged.                                                                                                                         |

## Applied locally, pending merge and deployment

Branch: `feat/dashboard-integration-rebased` (not pushed). Verified with `npm run typecheck`, `npm run lint` (0 errors, existing warnings only), `npm test` (6 files, 29 tests) and `npm run build` (28 routes, Next 16.4.5).

| Commit    | Scope                                                                                                                                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `b22ec59` | Rebased PR #53 dashboard/guest/gallery integration. Keeps newer `main` UI (`BackendPageHeader`, section `content.design`, Tailwind 4), adds multi-invitation dashboard flows, guest tokens and atomic builder saves, and adopts token-only RSVP via `submit_guest_rsvp` / `submit_guest_wish` / `resolve_public_guest`. Legacy `?to=` guest parameter removed. |
| `dccc1fb` | Splits the public guest RPC migration into two ordered phases (see rollout below).                                                                                                                                                                                |
| `05aa2cb` | Re-applies PR #52 background music: `backgroundMusicUrlSchema`, owner-scoped `saveInvitationBackgroundMusic`, builder URL input, and a `preload="none"` audio player in the shared renderer. No new column migration; `invitations.background_music_url` already exists. |
| `e85819b` | Re-applies PR #58 dashboard theme-category chips using backend semantic tokens instead of fixed Tailwind colors.                                                                                                                                                  |

PR #52 and PR #58 are closed unmerged on GitHub because their documentation was stale; only their code was re-applied. PR #53 is still open on GitHub and should be superseded by this branch or updated after review.

## Migration rollout order

1. **Phase 1 — `20261103100000_secure_public_guest_rsvp.sql`:** adds the `guests (invitation_id, public_token)` index and the token-verified RPCs while keeping the legacy anonymous write policies. Safe to apply before the app release because the old client keeps working.
2. **Deploy the application release** that uses `resolve_public_guest`, `submit_guest_rsvp` and `submit_guest_wish`.
3. **Phase 2 — `20261105120000_lock_public_guest_writes.sql`:** drops the legacy anonymous insert/update policies and revokes direct `anon` writes on `rsvps` and `wishes`. Apply only after step 2 is verified in production.

Neither migration has been applied to the target database. A read-only check previously confirmed `guests.public_token` values match `^[0-9a-f]{36}$` but `resolve_public_guest` did not exist yet, confirming the migration is still pending.

## Next work, in priority order

1. **Review and land the local branch safely.** Push `feat/dashboard-integration-rebased`, open or update the PR, review the full diff, and follow the migration rollout order above. Do not merge based only on a green check.
2. **Production verification.** Exercise real owner/admin accounts, public published/unpublished routes, guest-token RSVP/wishes, view-only general links, media operations and dashboard counts against the target Supabase project.
3. **Authorization and data-integrity hardening.** Add authenticated cross-user RLS behavior tests to CI; verify all relevant migrations and policies in the target environment. Review public interaction rate limiting, RSVP+wish atomicity, event-date validation and media cleanup/optimization gaps.
4. **Marketing and UX completion.** Audit the landing/marketing experience against the approved Indonesian, mobile-first, minimal editorial + modern luxe direction. Finish loading, empty, error, validation, keyboard, focus, contrast and reduced-motion states.
5. **Production readiness.** Confirm production/staging environment separation, domain, migration/release procedure, monitoring, backup/recovery, smoke tests and rollback procedure.

## Deferred product scope

These are not current blockers and must not be represented as implemented:

- Countdown section in the builder.
- Account deletion and platform settings persistence.
- Orders/payments, subscriptions and monetization.
- Video hosting, advanced audio hosting, CSV/Excel import and WhatsApp automation.
- Custom domains, collaboration, version history, advanced analytics/SEO and AI features.
- Timeless/no-expiration promise until storage and operating economics are validated.

Background music is a user-supplied URL only; LARISÉ is not an audio-hosting platform.

## Source-of-truth and status rules

- `PRD.md` records approved product intent and acceptance criteria.
- `Architecture.md` and `Design_System.md` record current technical and visual conventions.
- This file records delivery status as observed on the repository baseline and linked PRs.
- Notion's original Implementation Plan contains historical phase notes and has not kept pace with the repository after 2026-10-14. Treat its old phase checkboxes and PR states as historical, not current status.
- A PR is completed only after merge and verification. A migration is deployed only after application to, and verification against, the target database.
- If implementation and product intent disagree, record the gap and obtain a product decision. Never rewrite requirements merely to make the status look green.
