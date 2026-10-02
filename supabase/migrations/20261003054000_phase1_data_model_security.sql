-- Phase 1: data model and security hardening
-- The core invitation tables already exist in the remote project. This migration
-- makes the remaining Phase 1 invariants explicit and reproducible.

create index if not exists guests_invitation_id_idx
  on public.guests(invitation_id);

create index if not exists rsvps_invitation_id_idx
  on public.rsvps(invitation_id);

create index if not exists wishes_invitation_id_idx
  on public.wishes(invitation_id);

create index if not exists invitation_media_invitation_id_idx
  on public.invitation_media(invitation_id);

alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.theme_sections enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_sections enable row level security;
alter table public.invitation_media enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;

do $$
begin
  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and conname = 'invitations_status_check'
  ), 'invitations must constrain status to draft/published/unpublished';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and conname = 'invitations_slug_key'
  ), 'invitations.slug must be unique';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and conname = 'invitations_user_id_fkey'
  ), 'invitations.user_id must reference profiles';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitation_sections'::regclass
      and conname = 'invitation_sections_invitation_id_fkey'
  ), 'invitation_sections must belong to invitations';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.guests'::regclass
      and conname = 'guests_invitation_id_fkey'
  ), 'guests must belong to invitations';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.rsvps'::regclass
      and conname = 'rsvps_status_check'
  ), 'rsvps must constrain status to pending/attending/not_attending';

  assert exists (
    select 1 from pg_constraint
    where conrelid = 'public.wishes'::regclass
      and conname = 'wishes_visibility_check'
  ), 'wishes must constrain visibility to visible/hidden';

  assert (
    select relrowsecurity
    from pg_class
    where oid = 'public.invitations'::regclass
  ), 'invitations must have RLS enabled';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Users read own invitations'
      and cmd = 'SELECT'
  ), 'invitations must have an owner SELECT policy';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Users update own invitations'
      and cmd = 'UPDATE'
  ), 'invitations must have an owner UPDATE policy';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Users delete own invitations'
      and cmd = 'DELETE'
  ), 'invitations must have an owner DELETE policy';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Public read published invitations'
      and cmd = 'SELECT'
  ), 'published invitations must have a public SELECT policy';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'invitation_sections'
      and policyname = 'Users manage own invitation sections'
      and cmd = 'ALL'
  ), 'invitation sections must be owner protected';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'guests'
      and policyname = 'Users manage own guests'
      and cmd = 'ALL'
  ), 'guests must be owner protected';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'rsvps'
      and policyname = 'Users manage own rsvps'
      and cmd = 'ALL'
  ), 'rsvps must be owner protected';

  assert exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'wishes'
      and policyname = 'Users manage own wishes'
      and cmd = 'ALL'
  ), 'wishes must be owner protected';
end
$$;
