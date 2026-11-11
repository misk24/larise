-- Restrict direct public writes (contract step).
-- Apply ONLY after the token-based client (submit_guest_rsvp / submit_guest_wish /
-- resolve_public_guest) is deployed. Anonymous clients can no longer insert or
-- update guests, RSVPs or wishes directly; they must use the verified RPCs.

drop policy if exists "Public create guests for published invitations" on public.guests;
drop policy if exists "Public create rsvps for published invitations" on public.rsvps;
drop policy if exists "Public update rsvps for published invitations" on public.rsvps;

-- Defense in depth: public clients may not directly mutate RSVP rows.
revoke insert, update, delete on public.rsvps from anon;

-- Public clients can no longer forge guest identity in wish rows.
drop policy if exists "Public create wishes for published invitations" on public.wishes;
revoke insert on public.wishes from anon;
