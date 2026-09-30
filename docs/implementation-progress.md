# LARISÉ Implementation Progress

Updated: 2026-10-01

## M0/M1 checkpoint

- [x] Repository identified: `misk24/larise`
- [x] Supabase project identified: `larise` / `bfgyaibwpnjkjhgqlkby`
- [x] Confirmed PostgreSQL 17.6
- [x] Audited current Phase 1 tables and RLS policies
- [x] Added foundation schema migration file
- [x] Reconfirmed public tables have RLS enabled
- [x] Removed PUBLIC/anon/authenticated EXECUTE from `public.handle_new_user()` after security advisor finding
- [ ] Apply foundation migration to Supabase
- [ ] Normalize legacy invitation status values after application compatibility work
- [ ] Replace legacy `public` RLS policies with role-scoped policies
- [ ] Add database authorization tests
- [ ] Complete Auth boundary audit
- [ ] Build first vertical slice

## Current blockers

1. Supabase migration execution is not being accepted through the connected mutation tool in this session.
2. Existing application code still expects legacy invitation columns and status values, so destructive schema normalization would break the app.
3. Supabase security advisor still reports six mutable function search paths and leaked-password protection disabled. These are separate hardening tasks.

## Next implementation order

1. Apply and verify `20261001000000_foundation_invitation_schema.sql`.
2. Update TypeScript database contracts to match the live schema.
3. Refactor invitation creation/editing to structured section data.
4. Build section registry + shared renderer.
5. Implement publish/public route with the shared renderer.
