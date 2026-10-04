-- Phase 1: optimize admin RLS predicates for Postgres init-plan behavior.
drop policy if exists "Admins manage themes" on public.themes;
create policy "Admins manage themes" on public.themes for all to authenticated
using ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin')
with check ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

drop policy if exists "Admins manage theme sections" on public.theme_sections;
create policy "Admins manage theme sections" on public.theme_sections for all to authenticated
using ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin')
with check ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

drop policy if exists "Admins read all invitations" on public.invitations;
create policy "Admins read all invitations" on public.invitations for select to authenticated
using ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all to authenticated
using ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin')
with check ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');
