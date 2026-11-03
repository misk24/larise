-- Optimize admin invitation search across invitation, owner, and theme fields.
-- The view is restricted to service_role and runs with invoker privileges so
-- underlying RLS policies are not bypassed for any other database role.

create extension if not exists pg_trgm with schema extensions;

create index if not exists invitations_slug_search_trgm_idx
  on public.invitations using gin (
    (regexp_replace(lower(coalesce(slug, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists invitations_groom_name_search_trgm_idx
  on public.invitations using gin (
    (regexp_replace(lower(coalesce(groom_name, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists invitations_bride_name_search_trgm_idx
  on public.invitations using gin (
    (regexp_replace(lower(coalesce(bride_name, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists profiles_full_name_search_trgm_idx
  on public.profiles using gin (
    (regexp_replace(lower(coalesce(full_name, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists profiles_email_search_trgm_idx
  on public.profiles using gin (
    (regexp_replace(lower(coalesce(email, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists themes_name_search_trgm_idx
  on public.themes using gin (
    (regexp_replace(lower(coalesce(name, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create index if not exists themes_slug_search_trgm_idx
  on public.themes using gin (
    (regexp_replace(lower(coalesce(slug, '')), '[^[:alnum:]]', '', 'g')) extensions.gin_trgm_ops
  );

create or replace view public.admin_invitation_search
with (security_invoker = true)
as
select
  i.id,
  i.groom_name,
  i.bride_name,
  i.slug,
  i.status,
  i.created_at,
  p.full_name as owner_name,
  p.email as owner_email,
  t.name as theme_name,
  regexp_replace(lower(coalesce(i.slug, '')), '[^[:alnum:]]', '', 'g') as search_slug,
  regexp_replace(lower(coalesce(i.groom_name, '')), '[^[:alnum:]]', '', 'g') as search_groom_name,
  regexp_replace(lower(coalesce(i.bride_name, '')), '[^[:alnum:]]', '', 'g') as search_bride_name,
  regexp_replace(lower(coalesce(p.full_name, '')), '[^[:alnum:]]', '', 'g') as search_owner_name,
  regexp_replace(lower(coalesce(p.email, '')), '[^[:alnum:]]', '', 'g') as search_owner_email,
  regexp_replace(lower(coalesce(t.name, '')), '[^[:alnum:]]', '', 'g') as search_theme_name,
  regexp_replace(lower(coalesce(t.slug, '')), '[^[:alnum:]]', '', 'g') as search_theme_slug
from public.invitations as i
left join public.profiles as p on p.id = i.user_id
left join public.themes as t on t.id = i.theme_id;

revoke all on public.admin_invitation_search from public, anon, authenticated;
grant select on public.admin_invitation_search to service_role;

notify pgrst, 'reload schema';
