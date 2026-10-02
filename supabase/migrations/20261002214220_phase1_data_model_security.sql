-- Phase 1: data model + security verification
-- The core tables already existed before Phase 1 execution. This migration
-- makes the intended invariants explicit and fails closed if the live schema
-- drifts from the implementation plan.

create index if not exists themes_active_idx
  on public.themes(is_active)
  where is_active = true;

create index if not exists theme_sections_theme_position_idx
  on public.theme_sections(theme_id, position);

create index if not exists invitation_media_invitation_id_idx
  on public.invitation_media(invitation_id);

create index if not exists guests_invitation_id_idx
  on public.guests(invitation_id);

create index if not exists rsvps_invitation_id_idx
  on public.rsvps(invitation_id);

create index if not exists wishes_invitation_id_idx
  on public.wishes(invitation_id);

do $$
declare
  required_table text;
begin
  foreach required_table in array array[
    'profiles',
    'themes',
    'theme_sections',
    'invitations',
    'invitation_sections',
    'invitation_media',
    'guests',
    'rsvps',
    'wishes'
  ] loop
    if not exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = required_table
    ) then
      raise exception 'Phase 1 invariant failed: missing public.%', required_table;
    end if;
  end loop;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and conname = 'invitations_slug_key'
  ) then
    raise exception 'Phase 1 invariant failed: invitations.slug must be unique';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and conname = 'invitations_status_check'
  ) then
    raise exception 'Phase 1 invariant failed: invitation status constraint missing';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.rsvps'::regclass
      and conname = 'rsvps_status_check'
  ) then
    raise exception 'Phase 1 invariant failed: RSVP status constraint missing';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.wishes'::regclass
      and conname = 'wishes_visibility_check'
  ) then
    raise exception 'Phase 1 invariant failed: wishes visibility constraint missing';
  end if;
end
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'themes',
    'theme_sections',
    'invitations',
    'invitation_sections',
    'invitation_media',
    'guests',
    'rsvps',
    'wishes'
  ] loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = table_name
        and c.relrowsecurity
    ) then
      raise exception 'Phase 1 invariant failed: RLS disabled on public.%', table_name;
    end if;
  end loop;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Users read own invitations'
      and cmd = 'SELECT'
  ) then
    raise exception 'Phase 1 invariant failed: invitation ownership SELECT policy missing';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Users update own invitations'
      and cmd = 'UPDATE'
      and with_check is not null
  ) then
    raise exception 'Phase 1 invariant failed: invitation ownership UPDATE policy missing';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'invitations'
      and policyname = 'Public read published invitations'
      and cmd = 'SELECT'
  ) then
    raise exception 'Phase 1 invariant failed: published invitation public-read policy missing';
  end if;
end
$$;
