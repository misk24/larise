-- Reorder theme sections atomically and only for the supplied theme.
create or replace function public.admin_reorder_theme_sections(
  p_theme_id uuid,
  p_section_ids uuid[]
)
returns table(section_id uuid, section_position integer)
language plpgsql
security invoker
set search_path = public
as $$
declare
  existing_count integer;
  requested_count integer;
  temporary_offset integer;
begin
  if p_section_ids is null or cardinality(p_section_ids) = 0 then
    raise exception 'Section order cannot be empty';
  end if;

  select count(*) into existing_count
  from public.theme_sections ts
  where ts.theme_id = p_theme_id;

  select count(*) into requested_count
  from unnest(p_section_ids) as requested(section_id);

  if existing_count <> requested_count
    or exists (
      select 1 from public.theme_sections ts
      where ts.theme_id = p_theme_id
        and not (ts.id = any(p_section_ids))
    )
    or exists (
      select 1 from unnest(p_section_ids) as requested(section_id)
      where not exists (
        select 1 from public.theme_sections ts
        where ts.id = requested.section_id and ts.theme_id = p_theme_id
      )
    )
  then
    raise exception 'Section order must contain every section exactly once';
  end if;

  select coalesce(max(ts.position), -1) + existing_count + 1
  into temporary_offset
  from public.theme_sections ts
  where ts.theme_id = p_theme_id;

  update public.theme_sections ts
  set position = ts.position + temporary_offset
  where ts.theme_id = p_theme_id;

  return query
  with ordered as (
    select requested.section_id, (requested.ordinality - 1)::integer as new_position
    from unnest(p_section_ids) with ordinality as requested(section_id, ordinality)
  )
  update public.theme_sections ts
  set position = ordered.new_position
  from ordered
  where ts.id = ordered.section_id and ts.theme_id = p_theme_id
  returning ts.id, ts.position;
end;
$$;

revoke all on function public.admin_reorder_theme_sections(uuid, uuid[]) from public, anon, authenticated;
grant execute on function public.admin_reorder_theme_sections(uuid, uuid[]) to service_role;
