# LARISÉ Project Status

> Updated: 2026-11-05  
> Repository baseline: `main`  
> Product requirements: `PRD.md` and the approved LARISÉ PRD in Notion  
> This document is the concise delivery tracker. It does not replace product requirements or architecture documentation.

## Executive summary

The core invitation lifecycle is implemented: authentication, invitation creation, theme selection, section-based editing, shared rendering, image uploads, public invitations, guest responses, wishes, and dashboard management are present in the repository. Admin operations and the Theme Builder's section-level design configuration are also merged.

Current work is concentrated on dashboard integration/security refinements and optional background music. The most important release risk is not missing UI: it is coordinating the open dashboard integration PR with its production migration, then verifying real production behavior and authorization.

## Completed and merged

| Area | Verified delivery |
| --- | --- |
| Foundation and security baseline | Next.js/TypeScript, Supabase clients, CI, tests, domain boundaries, schema/RLS verification and core database assertions. |
| Authentication and account | Email/password, Google OAuth, email verification, password reset, protected routes, profile editing, Login & Security, provider-aware password restrictions, Danger Zone UI. Account deletion remains disabled. |
| Invitation management | Create/edit wizard, theme selection, stable slug and name-order rules, draft lifecycle, duplicate/delete, event date managed in the builder. |
| Themes and renderer | Theme data/sections, shared section registry and renderer used by preview/public invitation. |
| Invitation builder | Section content editing, visibility/order, validation, save state, preview and publish controls. |
| Media | Supabase Storage image upload, validation, ownership checks, metadata, deletion handling and gallery integration. Advanced server-side optimization remains deferred. |
| Public invitation | Published-only public route at `/undangan/[slug]`, shared renderer, server rendering and share metadata. |
| Guest response foundation | Guest, RSVP and wishes functionality has an earlier merged baseline. Do not confuse it with the additional token-security and dashboard integration work still in PR #53. |
| Dashboard and admin | Dashboard management baseline, admin overview/users/invitations, theme operations and shared backend components. PR #54 merged. |
| Theme Builder design configuration | Section-level background, typography, layout, buttons, images and decorative controls, validated configuration and real section renderer preview. PR #55 merged. |
| Backend visual system | Backend-scoped neutral/burgundy semantic palette with light/dark tokens. PR #56 merged. |

## In progress: open pull requests

| PR | Scope | Current status / required next step |
| --- | --- | --- |
| [#53 Dashboard management integration](https://github.com/misk24/larise/pull/53) | Gallery page, invitation-scoped guest/wishes/gallery management, autosave sequencing and token-based public RSVP/wishes security. | `main` has been merged into the branch and conflicts resolved. **Not merged.** The RSVP migration is now split: `20261110010000_guest_rsvp_rpcs.sql` (additive, safe to apply first) and `20261110010100_restrict_public_guest_writes.sql` (removes direct anonymous writes). Release order: apply the first migration, deploy the application, then apply the second. Each guest may leave at most 3 wishes. Personal links (`?guest=`) are `noindex` with a `same-origin` referrer policy. Verify guest-token RSVP/wishes against the target Supabase project after release. |

PRs [#52](https://github.com/misk24/larise/pull/52) (background music URL) and [#58](https://github.com/misk24/larise/pull/58) (theme-category palette cleanup) were closed without merge by the maintainer and are not planned. PR #57 was also closed without merge.

The builder and settings migrations from #53 (`20261029174143` to `20261029174834`) are already applied to the production Supabase project; only the RSVP migrations above remain.

## Next work, in priority order

1. **Close #53 safely.** Merge it, then run the coordinated RSVP release (expand migration, deploy, contract migration) described above.
2. **Production verification.** Exercise real owner/admin accounts, public published/unpublished routes, guest-token RSVP/wishes, media operations and dashboard counts against the target Supabase project.
3. **Authorization and data-integrity hardening.** Add authenticated cross-user RLS behavior tests to CI; verify all relevant migrations and policies in the target environment. Review public interaction rate limiting and media cleanup/optimization gaps.
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

Background music via a user-supplied URL (PR #52) was closed without merge; it is not currently planned, and the app is not an audio-hosting platform.

## Source-of-truth and status rules

- `PRD.md` records approved product intent and acceptance criteria.
- `Architecture.md` and `Design_System.md` record current technical and visual conventions.
- This file records delivery status as observed on the repository baseline and linked PRs.
- Notion's original Implementation Plan contains historical phase notes and has not kept pace with the repository after 2026-10-14. Treat its old phase checkboxes and PR states as historical, not current status.
- A PR is completed only after merge and verification. A migration is deployed only after application to, and verification against, the target database.
- If implementation and product intent disagree, record the gap and obtain a product decision. Never rewrite requirements merely to make the status look green.
