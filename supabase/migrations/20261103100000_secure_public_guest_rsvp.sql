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
  if p_guest_token is null or length(trim(p_guest_token)) < 20 then
    raise exception 'Token tamu tidak valid.' using errcode = '22023';
  end if;

  if p_status not in ('attending', 'not_attending') then
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
