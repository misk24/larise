-- Phase 6 hardening: public RSVP and wishes submission on published invitations.
-- Reads remain restricted by the existing public policies.

drop policy if exists "Public create guests for published invitations" on public.guests;
create policy "Public create guests for published invitations" on public.guests
for insert to anon, authenticated
with check (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.is_published = true
  )
);

drop policy if exists "Public create rsvps for published invitations" on public.rsvps;
create policy "Public create rsvps for published invitations" on public.rsvps
for insert to anon, authenticated
with check (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.is_published = true
  )
  and exists (
    select 1 from public.guests g
    where g.id = guest_id and g.invitation_id = rsvps.invitation_id
  )
);

drop policy if exists "Public update rsvps for published invitations" on public.rsvps;
create policy "Public update rsvps for published invitations" on public.rsvps
for update to anon, authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.is_published = true
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.is_published = true
  )
  and exists (
    select 1 from public.guests g
    where g.id = guest_id and g.invitation_id = rsvps.invitation_id
  )
);

drop policy if exists "Public create wishes for published invitations" on public.wishes;
create policy "Public create wishes for published invitations" on public.wishes
for insert to anon, authenticated
with check (
  visibility = 'visible'
  and exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.is_published = true
  )
);