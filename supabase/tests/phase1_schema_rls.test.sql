begin;

create extension if not exists pgtap with schema extensions;

select plan(18);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles has RLS enabled'
);
select ok((select relrowsecurity from pg_class where oid = 'public.themes'::regclass), 'themes has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.theme_sections'::regclass), 'theme_sections has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.invitations'::regclass), 'invitations has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.invitation_sections'::regclass), 'invitation_sections has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.invitation_media'::regclass), 'invitation_media has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.guests'::regclass), 'guests has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.rsvps'::regclass), 'rsvps has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.wishes'::regclass), 'wishes has RLS enabled');

select ok(
  exists(select 1 from pg_constraint where conrelid = 'public.invitations'::regclass and conname = 'invitations_slug_key'),
  'invitation slug is unique'
);
select ok(
  exists(select 1 from pg_constraint where conrelid = 'public.invitations'::regclass and conname = 'invitations_status_check'),
  'invitation status is constrained'
);
select ok(
  exists(select 1 from pg_constraint where conrelid = 'public.rsvps'::regclass and conname = 'rsvps_status_check'),
  'RSVP status is constrained'
);
select ok(
  exists(select 1 from pg_constraint where conrelid = 'public.wishes'::regclass and conname = 'wishes_visibility_check'),
  'wish visibility is constrained'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='Users read own invitations'),
  'invitation owner read policy exists'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='Users update own invitations'),
  'invitation owner update policy exists'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='Users delete own invitations'),
  'invitation owner delete policy exists'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='Public read published invitations'),
  'published invitation public read policy exists'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='guests' and policyname='Users manage own guests'),
  'guest ownership policy exists'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='rsvps' and policyname='Users manage own rsvps'),
  'RSVP ownership policy exists'
);

select * from finish();

rollback;
