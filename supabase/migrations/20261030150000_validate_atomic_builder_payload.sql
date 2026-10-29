-- Harden atomic builder saves with payload validation and immutable section identity.
create or replace function public.save_invitation_sections_atomic(
  p_invitation_id uuid,
  p_sections jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  submitted_count integer;
  distinct_id_count integer;
  distinct_position_count integer;
  matched_count integer;
  event_date_value date;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.invitations i
    where i.id = p_invitation_id and i.user_id = auth.uid()
  ) then
    raise exception 'Invitation not found' using errcode = 'P0002';
  end if;

  if p_sections is null or jsonb_typeof(p_sections) <> 'array' then
    raise exception 'Sections must be an array' using errcode = '22023';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_sections) as items(section)
    where jsonb_typeof(section) <> 'object'
      or nullif(section->>'id', '') is null
      or nullif(section->>'section_key', '') is null
      or nullif(section->>'section_type', '') is null
      or jsonb_typeof(section->'position') <> 'number'
      or (section->>'position') !~ '^-?[0-9]+      or jsonb_typeof(section->'content') <> 'object'
      or jsonb_typeof(section->'is_visible') <> 'boolean'
  ) then
    raise exception 'Invalid section payload' using errcode = '22023';
  end if;

  select count(*),
         count(distinct (section->>'id')::uuid),
         count(distinct (section->>'position')::integer)
    into submitted_count, distinct_id_count, distinct_position_count
  from jsonb_array_elements(p_sections) as items(section);

  if submitted_count = 0 or submitted_count > 50
     or submitted_count <> distinct_id_count
     or submitted_count <> distinct_position_count then
    raise exception 'Section IDs and positions must be unique, with 1 to 50 sections' using errcode = '22023';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_sections) as items(section)
    where (section->>'position')::integer < 0
  ) then
    raise exception 'Section positions must be non-negative integers' using errcode = '22023';
  end if;

  select count(*)
    into matched_count
  from public.invitation_sections s
  join jsonb_to_recordset(p_sections) as item(
    id uuid,
    section_key text,
    section_type text
  ) on item.id = s.id
  where s.invitation_id = p_invitation_id
    and s.section_key = item.section_key
    and s.section_type::text = item.section_type;

  if matched_count <> submitted_count then
    raise exception 'Section ownership or identity mismatch' using errcode = '42501';
  end if;

  update public.invitation_sections as s
  set
    position = item.position,
    content = item.content,
    is_visible = item.is_visible
  from jsonb_to_recordset(p_sections) as item(
    id uuid,
    section_key text,
    section_type text,
    position integer,
    content jsonb,
    is_visible boolean
  )
  where s.id = item.id
    and s.invitation_id = p_invitation_id
    and s.section_key = item.section_key
    and s.section_type::text = item.section_type;

  select nullif(s.content->>'date', '')::date
    into event_date_value
  from public.invitation_sections s
  where s.invitation_id = p_invitation_id
    and s.section_type::text = 'event'
  order by s.position
  limit 1;

  if exists (
    select 1 from public.invitation_sections s
    where s.invitation_id = p_invitation_id
      and s.section_type::text = 'event'
  ) then
    update public.invitations
    set event_date = event_date_value
    where id = p_invitation_id and user_id = auth.uid();
  end if;

  return true;
end;
$$;

revoke all on function public.save_invitation_sections_atomic(uuid, jsonb) from public;
grant execute on function public.save_invitation_sections_atomic(uuid, jsonb) to authenticated;

      or jsonb_typeof(section->'content') <> 'object'
      or jsonb_typeof(section->'is_visible') <> 'boolean'
  ) then
    raise exception 'Invalid section payload' using errcode = '22023';
  end if;

  select count(*),
         count(distinct (section->>'id')::uuid),
         count(distinct (section->>'position')::integer)
    into submitted_count, distinct_id_count, distinct_position_count
  from jsonb_array_elements(p_sections) as items(section);

  if submitted_count = 0 or submitted_count > 50
     or submitted_count <> distinct_id_count
     or submitted_count <> distinct_position_count then
    raise exception 'Section IDs and positions must be unique, with 1 to 50 sections' using errcode = '22023';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_sections) as items(section)
    where (section->>'position')::integer < 0
  ) then
    raise exception 'Section positions must be non-negative integers' using errcode = '22023';
  end if;

  select count(*)
    into matched_count
  from public.invitation_sections s
  join jsonb_to_recordset(p_sections) as item(
    id uuid,
    section_key text,
    section_type text
  ) on item.id = s.id
  where s.invitation_id = p_invitation_id
    and s.section_key = item.section_key
    and s.section_type::text = item.section_type;

  if matched_count <> submitted_count then
    raise exception 'Section ownership or identity mismatch' using errcode = '42501';
  end if;

  update public.invitation_sections as s
  set
    position = item.position,
    content = item.content,
    is_visible = item.is_visible
  from jsonb_to_recordset(p_sections) as item(
    id uuid,
    section_key text,
    section_type text,
    position integer,
    content jsonb,
    is_visible boolean
  )
  where s.id = item.id
    and s.invitation_id = p_invitation_id
    and s.section_key = item.section_key
    and s.section_type::text = item.section_type;

  select nullif(s.content->>'date', '')::date
    into event_date_value
  from public.invitation_sections s
  where s.invitation_id = p_invitation_id
    and s.section_type::text = 'event'
  order by s.position
  limit 1;

  if exists (
    select 1 from public.invitation_sections s
    where s.invitation_id = p_invitation_id
      and s.section_type::text = 'event'
  ) then
    update public.invitations
    set event_date = event_date_value
    where id = p_invitation_id and user_id = auth.uid();
  end if;

  return true;
end;
$$;

revoke all on function public.save_invitation_sections_atomic(uuid, jsonb) from public;
grant execute on function public.save_invitation_sections_atomic(uuid, jsonb) to authenticated;
