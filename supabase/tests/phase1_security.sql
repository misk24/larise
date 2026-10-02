-- Phase 1 database security checks.
-- Run against the target database with a test harness that supplies authenticated
-- JWT claims. These checks intentionally inspect policy predicates as well as
-- structural constraints so authorization cannot silently regress.
--
-- The project currently does not install pgTAP, so this file is kept as plain
-- SQL assertions and can be run by CI once a dedicated database test harness
-- is added.

do $$
declare
  policy record;
begin
  select * into policy
  from pg_policies
  where schemaname = 'public'
    and tablename = 'invitations'
    and policyname = 'Users read own invitations';

  if policy.qual is null or position('auth.uid()' in policy.qual) = 0 then
    raise exception 'Invitation SELECT policy does not enforce auth.uid ownership';
  end if;

  select * into policy
  from pg_policies
  where schemaname = 'public'
    and tablename = 'invitations'
    and policyname = 'Users update own invitations';

  if policy.qual is null or policy.with_check is null
     or position('auth.uid()' in policy.qual) = 0
     or position('auth.uid()' in policy.with_check) = 0 then
    raise exception 'Invitation UPDATE policy must enforce ownership in USING and WITH CHECK';
  end if;
end
$$;

do $$
declare
  child_table text;
begin
  foreach child_table in array array[
    'invitation_sections',
    'invitation_media',
    'guests',
    'rsvps',
    'wishes'
  ] loop
    if not exists (
      select 1
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename = child_table
        and p.roles = array['authenticated']::name[]
        and p.cmd = 'ALL'
        and p.qual like '%auth.uid()%'
        and p.with_check like '%auth.uid()%'
    ) then
      raise exception 'Missing authenticated ownership policy for public.%', child_table;
    end if;
  end loop;
end
$$;
