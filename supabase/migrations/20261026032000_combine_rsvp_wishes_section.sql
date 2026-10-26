-- RSVP and wishes now share one public section. Keep the wishes table intact;
-- only remove the duplicate section configuration rows.
delete from public.invitation_sections where section_type = 'wishes';
delete from public.theme_sections where section_type = 'wishes';

with desired_order(section_type, position) as (
  values
    ('cover', 0),
    ('opening', 1),
    ('quote', 2),
    ('couple', 3),
    ('event', 4),
    ('location', 5),
    ('gallery', 6),
    ('rsvp', 7),
    ('gift', 8),
    ('closing', 9)
)
update public.theme_sections ts
set position = desired_order.position
from desired_order
where ts.section_type = desired_order.section_type;

with desired_order(section_type, position) as (
  values
    ('cover', 0),
    ('opening', 1),
    ('quote', 2),
    ('couple', 3),
    ('event', 4),
    ('location', 5),
    ('gallery', 6),
    ('rsvp', 7),
    ('gift', 8),
    ('closing', 9)
)
update public.invitation_sections ins
set position = desired_order.position
from desired_order
where ins.section_type = desired_order.section_type;
