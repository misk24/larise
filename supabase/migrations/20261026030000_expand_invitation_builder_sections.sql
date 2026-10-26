-- Expand every theme and existing invitation to the supported 11-section builder structure.
-- Existing custom content is preserved; only missing section types are inserted.

with desired_sections(section_key, section_type, position, default_content, is_required) as (
  values
    ('cover', 'cover', 0, '{"eyebrow":"The Wedding of","title":"Nama Pasangan","subtitle":"Sebuah kisah yang kami rayakan bersama"}'::jsonb, true),
    ('opening', 'opening', 1, '{"title":"Dengan penuh kebahagiaan","body":"Kami mengundang Anda untuk menjadi bagian dari hari istimewa kami."}'::jsonb, false),
    ('quote', 'quote', 2, '{"quote":"","author":""}'::jsonb, false),
    ('couple', 'couple', 3, '{"title":"Mempelai","groom_name":"Nama Mempelai Pria","bride_name":"Nama Mempelai Wanita"}'::jsonb, true),
    ('event', 'event', 4, '{"title":"Acara","date":"","time":"","venue":"","address":""}'::jsonb, true),
    ('location', 'location', 5, '{"title":"Lokasi","venue":"","address":"","maps_url":""}'::jsonb, false),
    ('gallery', 'gallery', 6, '{"title":"Galeri","images":[]}'::jsonb, false),
    ('rsvp', 'rsvp', 7, '{}'::jsonb, false),
    ('wishes', 'wishes', 8, '{}'::jsonb, false),
    ('gift', 'gift', 9, '{"bank_name":"","account_number":"","account_name":""}'::jsonb, false),
    ('closing', 'closing', 10, '{"title":"Terima kasih","body":"Kehadiran dan doa Anda adalah hadiah bagi kami."}'::jsonb, false)
)
insert into public.theme_sections
  (theme_id, section_key, section_type, position, default_content, is_required, is_visible)
select t.id, d.section_key, d.section_type, d.position, d.default_content, d.is_required, true
from public.themes t
cross join desired_sections d
where not exists (
  select 1 from public.theme_sections existing
  where existing.theme_id = t.id and existing.section_key = d.section_key
);

with desired_order(section_type, position) as (
  values
    ('cover', 0), ('opening', 1), ('quote', 2), ('couple', 3), ('event', 4),
    ('location', 5), ('gallery', 6), ('rsvp', 7), ('wishes', 8), ('gift', 9), ('closing', 10)
)
update public.theme_sections ts
set position = desired_order.position
from desired_order
where ts.section_type = desired_order.section_type;

-- Countdown is no longer part of the supported builder section set.
delete from public.invitation_sections where section_type = 'countdown';
delete from public.theme_sections where section_type = 'countdown';

-- Existing invitations inherit any newly supported section missing from their theme clone.
insert into public.invitation_sections
  (invitation_id, section_key, section_type, position, content, is_visible)
select i.id, ts.section_key, ts.section_type, ts.position, ts.default_content, ts.is_visible
from public.invitations i
join public.theme_sections ts on ts.theme_id = i.theme_id
where not exists (
  select 1 from public.invitation_sections existing
  where existing.invitation_id = i.id and existing.section_key = ts.section_key
);

with desired_order(section_type, position) as (
  values
    ('cover', 0), ('opening', 1), ('quote', 2), ('couple', 3), ('event', 4),
    ('location', 5), ('gallery', 6), ('rsvp', 7), ('wishes', 8), ('gift', 9), ('closing', 10)
)
update public.invitation_sections ins
set position = desired_order.position
from desired_order
where ins.section_type = desired_order.section_type;
