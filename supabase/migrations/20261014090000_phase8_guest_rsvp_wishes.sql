-- Phase 8: owner management policies for guest, RSVP and wishes data.
-- Public submission policies are intentionally kept separate from owner management.

drop policy if exists "Owners manage guests for own invitations" on public.guests;
create policy "Owners manage guests for own invitations" on public.guests
for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id and i.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id and i.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners manage RSVPs for own invitations" on public.rsvps;
create policy "Owners manage RSVPs for own invitations" on public.rsvps
for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = rsvps.invitation_id and i.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = rsvps.invitation_id and i.user_id = (select auth.uid())
  )
  and exists (
    select 1 from public.guests g
    where g.id = rsvps.guest_id and g.invitation_id = rsvps.invitation_id
  )
);

drop policy if exists "Owners manage wishes for own invitations" on public.wishes;
create policy "Owners manage wishes for own invitations" on public.wishes
for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = wishes.invitation_id and i.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = wishes.invitation_id and i.user_id = (select auth.uid())
  )
);

create index if not exists guests_invitation_name_idx
  on public.guests(invitation_id, name);
create index if not exists rsvps_guest_id_idx
  on public.rsvps(guest_id);
create index if not exists wishes_invitation_created_at_idx
  on public.wishes(invitation_id, created_at desc);
