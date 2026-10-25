-- LARISÉ invitation creation flow: store display identity separately from URL identity.
alter table public.invitations
  add column if not exists groom_nickname text not null default '',
  add column if not exists bride_nickname text not null default '',
  add column if not exists name_order text not null default 'groom_first',
  add column if not exists event_date date;

alter table public.invitations
  drop constraint if exists invitations_name_order_check;

alter table public.invitations
  add constraint invitations_name_order_check
  check (name_order in ('groom_first', 'bride_first'));

-- Backfill existing records without changing their current public URLs.
update public.invitations
set
  groom_nickname = coalesce(nullif(groom_nickname, ''), groom_name),
  bride_nickname = coalesce(nullif(bride_nickname, ''), bride_name),
  event_date = coalesce(event_date, resepsi_date, akad_date)
where groom_nickname = ''
   or bride_nickname = ''
   or event_date is null;

create or replace function public.prevent_invitation_identity_changes()
returns trigger
language plpgsql
as $$
begin
  if new.slug is distinct from old.slug then
    raise exception 'Slug undangan tidak dapat diubah setelah draft dibuat.'
      using errcode = '23514';
  end if;

  if new.name_order is distinct from old.name_order then
    raise exception 'Urutan nama pasangan tidak dapat diubah setelah draft dibuat.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists invitations_identity_immutable on public.invitations;

create trigger invitations_identity_immutable
before update of slug, name_order on public.invitations
for each row
execute function public.prevent_invitation_identity_changes();
