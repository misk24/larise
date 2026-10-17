-- Auth hardening: one case-insensitive email identity and explicit provider values.
-- Existing duplicate emails (if any) must be reconciled before applying this migration.
update public.profiles set email = lower(btrim(email)) where email is not null;

create unique index if not exists profiles_email_lower_unique
  on public.profiles (lower(email))
  where email is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_provider_check'
  ) then
    alter table public.profiles
      add constraint profiles_provider_check
      check (provider in ('email', 'google'));
  end if;
end $$;

-- Keep role assignment server-controlled; never accept it from user-editable metadata.
