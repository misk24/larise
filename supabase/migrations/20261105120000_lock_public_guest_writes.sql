-- Phase 2 of 2: remove legacy anonymous write paths.
--
-- Run this only after 20261103100000_secure_public_guest_rsvp.sql has been
-- applied AND the app release that uses submit_guest_rsvp /
-- submit_guest_wish / resolve_public_guest is deployed. Otherwise guests on
-- the previous app version can no longer submit RSVP or wishes.

drop policy if exists "Public create guests for published invitations" on public.guests;
drop policy if exists "Public create rsvps for published invitations" on public.rsvps;
drop policy if exists "Public update rsvps for published invitations" on public.rsvps;
drop policy if exists "Public create wishes for published invitations" on public.wishes;

-- Defense in depth: public clients may not directly mutate RSVP or wish rows.
revoke insert, update, delete on public.rsvps from anon;
revoke insert on public.wishes from anon;
