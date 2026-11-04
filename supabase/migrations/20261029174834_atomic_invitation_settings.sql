-- Update invitation settings and replace theme sections atomically.
-- If cloning fails, the theme and invitation details roll back together.
create or replace function public.update_invitation_settings_atomic(
  p_invitation_id uuid,
  p_theme_id uuid,
  p_groom_name text,
  p_groom_nickname text,
  p_bride_name text,
  p_bride_nickname text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_theme_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_invitation_id is null or p_theme_id is null
     or nullif(btrim(p_groom_name), '') is null
     or nullif(btrim(p_groom_nickname), '') is null
     or nullif(btrim(p_bride_name), '') is null
     or nullif(btrim(p_bride_nickname), '') is null then
    raise exception 'Invalid invitation settings' using errcode = '22023';
  end if;

  select i.theme_id
    into current_theme_id
  from public.invitations i
  where i.id = p_invitation_id
    and i.user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Invitation not found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.themes t
    where t.id = p_theme_id and t.is_active = true
  ) then
    raise exception 'Theme unavailable' using errcode = '22023';
  end if;

  update public.invitations
  set theme_id = p_theme_id,
      groom_name = btrim(p_groom_name),
      groom_nickname = btrim(p_groom_nickname),
      bride_name = btrim(p_bride_name),
      bride_nickname = btrim(p_bride_nickname)
  where id = p_invitation_id
    and user_id = auth.uid();

  if current_theme_id is distinct from p_theme_id then
    perform public.clone_theme_sections_to_invitation(
      p_theme_id,
      p_invitation_id
    );
  end if;

  return true;
end;
$$;

revoke all on function public.update_invitation_settings_atomic(uuid, uuid, text, text, text, text) from public;
grant execute on function public.update_invitation_settings_atomic(uuid, uuid, text, text, text, text) to authenticated;
