-- Phase 6: media storage foundation
-- Invitation media is stored under <user_id>/<invitation_id>/<uuid>.<ext>.
-- The bucket is public for guest-facing invitation images, while writes and
-- mutations remain restricted to the authenticated owner path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-media',
  'invitation-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Invitation media upload own folder" on storage.objects;
create policy "Invitation media upload own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Invitation media read own objects" on storage.objects;
create policy "Invitation media read own objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Invitation media update own objects" on storage.objects;
create policy "Invitation media update own objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Invitation media delete own objects" on storage.objects;
create policy "Invitation media delete own objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'invitation-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
