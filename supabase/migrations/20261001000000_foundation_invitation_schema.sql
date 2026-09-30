-- LARISÉ foundation: invitation domain schema alignment
-- Apply through Supabase migrations before enabling the Phase 1 application flow.

alter table public.invitations
  add column if not exists groom_name text not null default '',
  add column if not exists groom_father text,
  add column if not exists groom_mother text,
  add column if not exists groom_photo_url text,
  add column if not exists bride_name text not null default '',
  add column if not exists bride_father text,
  add column if not exists bride_mother text,
  add column if not exists bride_photo_url text,
  add column if not exists couple_photo_url text,
  add column if not exists akad_date date,
  add column if not exists akad_time time,
  add column if not exists akad_location text,
  add column if not exists akad_address text,
  add column if not exists akad_maps_url text,
  add column if not exists resepsi_date date,
  add column if not exists resepsi_time time,
  add column if not exists resepsi_location text,
  add column if not exists resepsi_address text,
  add column if not exists resepsi_maps_url text,
  add column if not exists love_story text,
  add column if not exists opening_text text not null default '',
  add column if not exists closing_text text not null default '',
  add column if not exists gallery_photos jsonb not null default '[]'::jsonb,
  add column if not exists background_music_url text,
  add column if not exists show_countdown boolean not null default true,
  add column if not exists show_gallery boolean not null default true,
  add column if not exists show_love_story boolean not null default true,
  add column if not exists show_gift boolean not null default false,
  add column if not exists show_rsvp boolean not null default true,
  add column if not exists bank_accounts jsonb not null default '[]'::jsonb,
  add column if not exists gift_address text;

alter table public.invitation_sections
  add column if not exists updated_at timestamptz not null default now();

create index if not exists invitations_user_id_idx on public.invitations(user_id);
create index if not exists invitations_theme_id_idx on public.invitations(theme_id);
create index if not exists invitations_published_idx
  on public.invitations(is_published)
  where is_published = true;

create index if not exists invitation_sections_invitation_id_idx
  on public.invitation_sections(invitation_id);
create index if not exists invitation_sections_position_idx
  on public.invitation_sections(invitation_id, position);

alter table public.invitation_media enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;

-- NOTE:
-- The existing invitation status constraint currently uses the legacy values
-- draft/pending_payment/active/expired. Status normalization to
-- draft/published/unpublished is intentionally deferred until the application
-- writes are migrated in the same change, preventing a mixed-state deployment.
