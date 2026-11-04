-- Public RSVP submissions must prove possession of the guest's public token.
-- Anonymous clients cannot insert/update guest or RSVP rows directly anymore.

drop policy if exists "Public create guests for published invitations" on public.guests;
drop policy if exists "Public create rsvps for published invitations" on public.rsvps;
drop policy if exists "Public update rsvps for published invitations" on public.rsvps;

create or replace function public.submit_guest_rsvp(
  p_invitation_id uuid,
  p_guest_token text,
  p_status text,
  p_attendee_count integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_guest_id uuid;
  v_rsvp_id uuid;
begin
  if p_invitation_id is null or p_guest_token is null or p_guest_token !~ '^[0-9a-f]{36}$' then
    raise exception 'Token tamu tidak valid.' using errcode = '22023';
  end if;

  if p_status is null or p_status not in ('attending', 'not_attending') then
    raise exception 'Status RSVP tidak valid.' using errcode = '22023';
  end if;

  if (p_status = 'attending' and (p_attendee_count is null or p_attendee_count < 1 or p_attendee_count > 10))
     or (p_status = 'not_attending' and (p_attendee_count is null or p_attendee_count <> 0)) then
    raise exception 'Jumlah tamu tidak valid.' using errcode = '22023';
  end if;

  -- Lock the guest row so concurrent submissions for the same token serialize.
  select g.id into v_guest_id
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where g.invitation_id = p_invitation_id
    and g.public_token = p_guest_token
    and i.status = 'published'
    and i.is_published = true
  for update of g;

  if v_guest_id is null then
    raise exception 'Link tamu tidak valid atau undangan belum diterbitkan.' using errcode = '42501';
  end if;

  select r.id into v_rsvp_id
  from public.rsvps r
  where r.guest_id = v_guest_id
  for update;

  if v_rsvp_id is null then
    insert into public.rsvps (invitation_id, guest_id, status, attendee_count)
    values (p_invitation_id, v_guest_id, p_status, p_attendee_count)
    returning id into v_rsvp_id;
  else
    update public.rsvps
    set status = p_status,
        attendee_count = p_attendee_count,
        updated_at = now()
    where id = v_rsvp_id;
  end if;

  return v_rsvp_id;
end;
$$;

revoke all on function public.submit_guest_rsvp(uuid, text, text, integer) from public;
grant execute on function public.submit_guest_rsvp(uuid, text, text, integer) to anon, authenticated;

-- Defense in depth: public clients may not directly mutate RSVP rows.
revoke insert, update, delete on public.rsvps from anon;


-- Resolve the opaque guest token without exposing guest rows to anonymous clients.
create or replace function public.resolve_public_guest(
  p_invitation_id uuid,
  p_guest_token text
)
returns table (guest_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select g.name
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where g.invitation_id = p_invitation_id
    and p_guest_token ~ '^[0-9a-f]{36}$'
    and g.public_token = p_guest_token
    and i.status = 'published'
    and i.is_published = true
  limit 1;
$$;

revoke all on function public.resolve_public_guest(uuid, text) from public;
grant execute on function public.resolve_public_guest(uuid, text) to anon, authenticated;

-- Wishes use the same verified identity, preventing arbitrary display-name spoofing.
create or replace function public.submit_guest_wish(
  p_invitation_id uuid,
  p_guest_token text,
  p_message text
)
returns public.wishes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
  v_wish public.wishes%rowtype;
begin
  if p_invitation_id is null or p_guest_token is null or p_guest_token !~ '^[0-9a-f]{36}$' then
    raise exception 'Token tamu tidak valid.' using errcode = '22023';
  end if;

  if p_message is null or length(trim(p_message)) < 1 or length(p_message) > 1000 then
    raise exception 'Ucapan wajib diisi dan maksimal 1000 karakter.' using errcode = '22023';
  end if;

  select g.* into v_guest
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  where g.invitation_id = p_invitation_id
    and g.public_token = p_guest_token
    and i.status = 'published'
    and i.is_published = true;

  if v_guest.id is null then
    raise exception 'Link tamu tidak valid atau undangan belum diterbitkan.' using errcode = '42501';
  end if;

  insert into public.wishes (invitation_id, guest_id, guest_name, message, visibility)
  values (p_invitation_id, v_guest.id, v_guest.name, trim(p_message), 'visible')
  returning * into v_wish;

  return v_wish;
end;
$$;

revoke all on function public.submit_guest_wish(uuid, text, text) from public;
grant execute on function public.submit_guest_wish(uuid, text, text) to anon, authenticated;

-- Public clients can no longer forge guest identity in wish rows.
drop policy if exists "Public create wishes for published invitations" on public.wishes;
revoke insert on public.wishes from anon;
