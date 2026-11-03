-- Reorder theme sections atomically. The function validates the complete section set
-- and uses temporary negative positions to avoid collisions with unique position indexes.
create or replace function public.admin_reorder_theme_sections(
  p_theme_id uuid,
  p_section_ids uuid[]
)
returns table(id uuid, position integer)
language plpgsql
security invoker
set search_path = public
as $$
declare
  existing_count integer;
  requested_count integer;
begin
  if p_section_ids is null or cardinality(p_section_ids) = 0 then
    raise exception 'Section order cannot be empty';
  end if;

  select count(*) into existing_count
  from public.theme_sections
  where theme_id = p_theme_id;

  select count(*) into requested_count
  from unnest(p_section_ids) as requested(id);

  if existing_count <> requested_count or exists (
    select 1 from public.theme_sections ts
    where ts.theme_id = p_theme_id
      and not (ts.id = any(p_section_ids))
  ) or exists (
    select 1 from unnest(p_section_ids) requested(id)
    where not exists (
      select 1 from public.theme_sections ts
      where ts.id = requested.id and ts.theme_id = p_theme_id
    )
  ) then
    raise exception 'Section order must contain every section exactly once';
  end if;

  update public.theme_sections
  set position = -position - 1
  where theme_id = p_theme_id;

  return query
  with ordered as (
    select requested.id, (requested.ordinality - 1)::integer as new_position
    from unnest(p_section_ids) with ordinality as requested(id, ordinality)
  )
  update public.theme_sections ts
  set position = ordered.new_position
  from ordered
  where ts.id = ordered.id and ts.theme_id = p_theme_id
  returning ts.id, ts.position;
end;
$$;

revoke all on function public.admin_reorder_theme_sections(uuid, uuid[]) from public, anon, authenticated;
grant execute on function public.admin_reorder_theme_sections(uuid, uuid[]) to service_role;
