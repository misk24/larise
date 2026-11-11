-- Base tables that were originally created in the Supabase dashboard (no migration creates them).
-- Mirrors the production definitions; RLS policies and grants come from supabase/migrations.
set search_path = "$user", public, extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  provider text not null check (provider in ('email','google')),
  full_name text, phone text, avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.themes (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null, slug text not null unique, description text, thumbnail_url text, preview_url text,
  price numeric not null default 0,
  category text not null default 'elegant' check (category in ('elegant','minimalist','traditional','modern','rustic','floral')),
  features jsonb not null default '[]'::jsonb, is_active boolean not null default true, is_premium boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.theme_sections (
  id uuid primary key default extensions.uuid_generate_v4(),
  theme_id uuid not null references public.themes(id) on delete cascade,
  section_key text not null, section_type text not null, position integer not null,
  default_content jsonb not null default '{}'::jsonb, is_required boolean not null default false, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint theme_sections_unique unique (theme_id, section_key)
);
create table public.invitations (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  theme_id uuid references public.themes(id) on delete set null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  is_published boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  groom_name text not null default '', groom_father text, groom_mother text, groom_photo_url text,
  bride_name text not null default '', bride_father text, bride_mother text, bride_photo_url text,
  couple_photo_url text,
  akad_date date, akad_time time, akad_location text, akad_address text, akad_maps_url text,
  resepsi_date date, resepsi_time time, resepsi_location text, resepsi_address text, resepsi_maps_url text,
  love_story text, opening_text text not null default '', closing_text text not null default '',
  gallery_photos jsonb not null default '[]'::jsonb, background_music_url text,
  show_countdown boolean not null default true, show_gallery boolean not null default true,
  show_love_story boolean not null default true, show_gift boolean not null default false, show_rsvp boolean not null default true,
  bank_accounts jsonb not null default '[]'::jsonb, gift_address text,
  groom_nickname text not null default '', bride_nickname text not null default '',
  name_order text not null default 'groom_first' check (name_order in ('groom_first','bride_first')),
  event_date date,
  constraint invitations_publish_state_check check (is_published = (status = 'published'))
);
create table public.invitation_sections (
  id uuid primary key default extensions.uuid_generate_v4(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  section_key text not null, section_type text not null, position integer not null default 0,
  content jsonb not null default '{}'::jsonb, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint invitation_sections_unique unique (invitation_id, section_key)
);
create table public.invitation_media (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  storage_path text not null, file_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  file_size_bytes bigint not null check (file_size_bytes > 0),
  width integer, height integer,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null, phone text, email text, group_name text,
  public_token text not null unique default encode(extensions.gen_random_bytes(18), 'hex'),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','attending','not_attending')),
  attendee_count integer not null default 0 check (attendee_count >= 0),
  message text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint rsvps_guest_unique unique (guest_id)
);
create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null, message text not null,
  visibility text not null default 'visible' check (visibility in ('visible','hidden')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
-- Row level security is switched on here because the dashboard did that for production.
alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.theme_sections enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_sections enable row level security;
alter table public.invitation_media enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;

-- Policies that existed before the first migration (created in the dashboard).
-- Migrations later add/replace others (admin policies, owner policies, token RPC changes).
create policy "Users read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Public read active themes" on public.themes for select to anon, authenticated using (is_active = true);
create policy "Public read active theme sections" on public.theme_sections for select to anon, authenticated
  using (exists (select 1 from public.themes t where t.id = theme_sections.theme_id and t.is_active = true));

create policy "Public read published invitations" on public.invitations for select to anon, authenticated
  using (status = 'published' and is_published = true);
create policy "Users read own invitations" on public.invitations for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own invitations" on public.invitations for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own invitations" on public.invitations for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own invitations" on public.invitations for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Public read published invitation sections" on public.invitation_sections for select to anon, authenticated
  using (exists (select 1 from public.invitations i where i.id = invitation_sections.invitation_id and i.status = 'published' and i.is_published = true));
create policy "Users manage own invitation sections" on public.invitation_sections for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = invitation_sections.invitation_id and i.user_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = invitation_sections.invitation_id and i.user_id = (select auth.uid())));

create policy "Public read published invitation media" on public.invitation_media for select to anon, authenticated
  using (exists (select 1 from public.invitations i where i.id = invitation_media.invitation_id and i.status = 'published' and i.is_published = true));
create policy "Users manage own invitation media" on public.invitation_media for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = invitation_media.invitation_id and i.user_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = invitation_media.invitation_id and i.user_id = (select auth.uid())));

create policy "Users manage own guests" on public.guests for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = guests.invitation_id and i.user_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = guests.invitation_id and i.user_id = (select auth.uid())));
create policy "Users manage own rsvps" on public.rsvps for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = rsvps.invitation_id and i.user_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = rsvps.invitation_id and i.user_id = (select auth.uid())));
create policy "Users manage own wishes" on public.wishes for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = wishes.invitation_id and i.user_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = wishes.invitation_id and i.user_id = (select auth.uid())));
create policy "Public read visible published wishes" on public.wishes for select to anon, authenticated
  using (visibility = 'visible' and exists (select 1 from public.invitations i where i.id = wishes.invitation_id and i.status = 'published' and i.is_published = true));
