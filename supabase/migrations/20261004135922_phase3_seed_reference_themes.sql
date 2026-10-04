insert into public.themes
  (name, slug, description, thumbnail_url, preview_url, price, category, features, is_active, is_premium)
values
  ('Aurelia', 'aurelia', 'Tema elegan dengan nuansa hangat untuk undangan klasik-modern.', null, null, 0, 'elegant', '["Tipografi elegan","Layout editorial","Warna hangat"]'::jsonb, true, false),
  ('Serena', 'serena', 'Tema minimalis dengan ruang putih dan fokus pada cerita pasangan.', null, null, 0, 'minimalist', '["Minimalis","Mobile-first","Fokus foto"]'::jsonb, true, false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  features = excluded.features,
  is_active = excluded.is_active,
  is_premium = excluded.is_premium,
  updated_at = now();

with theme_data as (
  select id, slug from public.themes where slug in ('aurelia','serena')
)
insert into public.theme_sections
  (theme_id, section_key, section_type, position, default_content, is_required, is_visible)
select
  t.id, s.section_key, s.section_type, s.position, s.default_content::jsonb, s.is_required, true
from theme_data t
cross join (values
  ('cover','cover',0,'{"eyebrow":"The Wedding of","title":"Nama Pasangan","subtitle":"Sebuah kisah yang kami rayakan bersama"}',true),
  ('opening','opening',1,'{"title":"Dengan penuh kebahagiaan","body":"Kami mengundang Anda untuk menjadi bagian dari hari istimewa kami."}',false),
  ('couple','couple',2,'{"title":"Mempelai","groom_name":"Nama Mempelai Pria","bride_name":"Nama Mempelai Wanita"}',true),
  ('event','event',3,'{"title":"Acara","date":"","time":"","venue":"","address":""}',true),
  ('closing','closing',4,'{"title":"Terima kasih","body":"Kehadiran dan doa Anda adalah hadiah bagi kami."}',false)
) as s(section_key,section_type,position,default_content,is_required)
where not exists (
  select 1 from public.theme_sections existing
  where existing.theme_id = t.id and existing.section_key = s.section_key
);
