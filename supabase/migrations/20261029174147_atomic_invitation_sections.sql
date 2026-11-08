-- Save builder sections and synchronize the event date in one database transaction.
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
  distinct_count integer;
  owned_count integer;
  event_date_value date;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.invitations i
    where i.id = p_invitation_id
      and i.user_id = auth.uid()
  ) then
    raise exception 'Invitation not found' using errcode = 'P0002';
  end if;

  if jsonb_typeof(p_sections) <> 'array' then
    raise exception 'Sections must be an array' using errcode = '22023';
  end if;

  select count(*), count(distinct (section->>'id')::uuid)
    into submitted_count, distinct_count
  from jsonb_array_elements(p_sections) as items(section);

  if submitted_count = 0 or submitted_count > 50 or submitted_count <> distinct_count then
    raise exception 'Invalid section collection' using errcode = '22023';
  end if;

  select count(*)
    into owned_count
  from public.invitation_sections s
  join jsonb_to_recordset(p_sections) as item(id uuid)
    on item.id = s.id
  where s.invitation_id = p_invitation_id;

  if owned_count <> submitted_count then
    raise exception 'Section ownership mismatch' using errcode = '42501';
  end if;

  update public.invitation_sections as s
  set
    section_key = item.section_key,
    position = item.position,
    content = item.content,
    is_visible = item.is_visible
  from jsonb_to_recordset(p_sections) as item(
    id uuid,
    section_key text,
    position integer,
    content jsonb,
    is_visible boolean
  )
  where s.id = item.id
    and s.invitation_id = p_invitation_id;

  select nullif(item.content->>'date', '')::date
    into event_date_value
  from jsonb_to_recordset(p_sections) as item(
    section_type text,
    content jsonb
  )
  where item.section_type = 'event'
  limit 1;

  if exists (
    select 1
    from jsonb_to_recordset(p_sections) as item(section_type text)
    where item.section_type = 'event'
  ) then
    update public.invitations
    set event_date = event_date_value
    where id = p_invitation_id
      and user_id = auth.uid();
  end if;

  return true;
end;
$$;

revoke all on function public.save_invitation_sections_atomic(uuid, jsonb) from public;
grant execute on function public.save_invitation_sections_atomic(uuid, jsonb) to authenticated;
