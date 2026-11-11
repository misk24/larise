-- Cleanup flagged by the Supabase performance advisor. No change in who can do what:
-- the dropped policies/indexes are exact duplicates of ones that stay.

-- 1. Legacy owner policies that duplicate "Users manage own ..." (same owner check).
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname like 'Owners manage %'
      and tablename in ('invitation_media', 'invitation_sections', 'guests', 'rsvps', 'wishes')
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- 2. Evaluate the admin JWT check once per query instead of once per row.
do $$
declare
  admin_check constant text := $c$(((select auth.jwt()) -> 'app_metadata') ->> 'role') = 'admin'$c$;
begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'themes' and policyname = 'Admins manage themes') then
    execute format('alter policy "Admins manage themes" on public.themes using (%1$s) with check (%1$s)', admin_check);
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'theme_sections' and policyname = 'Admins manage theme sections') then
    execute format('alter policy "Admins manage theme sections" on public.theme_sections using (%1$s) with check (%1$s)', admin_check);
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Admins manage profiles') then
    execute format('alter policy "Admins manage profiles" on public.profiles using (%1$s) with check (%1$s)', admin_check);
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'invitations' and policyname = 'Admins read all invitations') then
    execute format('alter policy "Admins read all invitations" on public.invitations using (%1$s)', admin_check);
  end if;
end $$;

-- 3. Identical duplicate indexes on invitation_sections (one of each pair stays).
drop index if exists public.idx_invitation_sections_invitation_id;
drop index if exists public.invitation_sections_invitation_position_idx;
