-- Enforce invitation ownership on builder data at the database boundary.
-- Existing public-read policies for published invitations remain separate.

drop policy if exists "Owners manage sections for own invitations" on public.invitation_sections;
create policy "Owners manage sections for own invitations" on public.invitation_sections
for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_sections.invitation_id
      and i.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_sections.invitation_id
      and i.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners manage media for own invitations" on public.invitation_media;
create policy "Owners manage media for own invitations" on public.invitation_media
for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_media.invitation_id
      and i.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = invitation_media.invitation_id
      and i.user_id = (select auth.uid())
  )
);
