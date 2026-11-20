/**
 * Field definitions and pure helpers for the Theme Builder design inspector.
 * Keys and bounds mirror `lib/validation/section-design.ts`; the server remains the validator.
 */

export type SectionContent = Record<string, unknown>;

export type DesignGroup =
  | "background"
  | "typography"
  | "layout"
  | "button"
  | "image"
  | "icon"
  | "divider"
  | "ornament";

type Option = { value: string; label: string };
type FieldBase = { group: DesignGroup; key: string; label: string; hint?: string; wide?: boolean };

export type DesignField = FieldBase &
  (
    | { kind: "color"; placeholder?: string }
    | { kind: "text"; placeholder?: string; maxLength?: number }
    | { kind: "number"; min: number; max: number; step?: number }
    | { kind: "select"; options: Option[]; fallback: string }
  );

export type DesignPanel = { id: string; title: string; description: string; fields: DesignField[] };

const ALIGN: Option[] = [
  { value: "left", label: "Kiri" },
  { value: "center", label: "Tengah" },
  { value: "right", label: "Kanan" },
];

export const DESIGN_PANELS: DesignPanel[] = [
  {
    id: "background",
    title: "Latar belakang",
    description: "Warna, gambar, atau gradient di belakang section.",
    fields: [
      { group: "background", key: "type", kind: "select", label: "Jenis", fallback: "none", options: [
        { value: "none", label: "Bawaan section" }, { value: "color", label: "Warna" },
        { value: "image", label: "Gambar" }, { value: "gradient", label: "Gradient" },
      ] },
      { group: "background", key: "value", kind: "text", label: "Warna, URL, atau gradient", placeholder: "#f8f4ef, https://..., linear-gradient(...)", maxLength: 2048, wide: true },
      { group: "background", key: "position", kind: "text", label: "Posisi gambar", placeholder: "center" },
      { group: "background", key: "size", kind: "select", label: "Ukuran gambar", fallback: "cover", options: [
        { value: "cover", label: "Cover" }, { value: "contain", label: "Contain" }, { value: "auto", label: "Auto" },
      ] },
      { group: "background", key: "overlay", kind: "number", label: "Overlay gelap", hint: "0 sampai 1", min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    id: "typography",
    title: "Tipografi",
    description: "Font, ukuran, warna, dan perataan heading serta isi.",
    fields: [
      { group: "typography", key: "headingFontFamily", kind: "text", label: "Font heading", placeholder: "Georgia, serif", maxLength: 100 },
      { group: "typography", key: "bodyFontFamily", kind: "text", label: "Font isi", placeholder: "Arial, sans-serif", maxLength: 100 },
      { group: "typography", key: "headingFontSize", kind: "number", label: "Ukuran heading (px)", min: 12, max: 120 },
      { group: "typography", key: "bodyFontSize", kind: "number", label: "Ukuran isi (px)", min: 8, max: 48 },
      { group: "typography", key: "headingColor", kind: "color", label: "Warna heading", placeholder: "#2b2927" },
      { group: "typography", key: "bodyColor", kind: "color", label: "Warna isi", placeholder: "#5b5550" },
      { group: "typography", key: "headingAlignment", kind: "select", label: "Perataan heading", fallback: "center", options: ALIGN },
      { group: "typography", key: "bodyAlignment", kind: "select", label: "Perataan isi", fallback: "center", options: ALIGN },
      { group: "typography", key: "headingFontWeight", kind: "number", label: "Ketebalan heading", min: 100, max: 900, step: 100 },
      { group: "typography", key: "bodyFontWeight", kind: "number", label: "Ketebalan isi", min: 100, max: 900, step: 100 },
      { group: "typography", key: "lineHeight", kind: "number", label: "Tinggi baris", min: 0.8, max: 3, step: 0.05 },
      { group: "typography", key: "letterSpacing", kind: "number", label: "Jarak huruf (px)", min: -5, max: 20, step: 0.5 },
      // Umum: dipakai sebagai cadangan bila heading/isi tidak diatur sendiri.
      { group: "typography", key: "fontFamily", kind: "text", label: "Font umum", hint: "Cadangan", placeholder: "Georgia, serif", maxLength: 100 },
      { group: "typography", key: "color", kind: "color", label: "Warna umum", hint: "Cadangan", placeholder: "#2b2927" },
      { group: "typography", key: "fontWeight", kind: "number", label: "Ketebalan umum", hint: "Cadangan", min: 100, max: 900, step: 100 },
      { group: "typography", key: "alignment", kind: "select", label: "Perataan umum", fallback: "center", options: ALIGN },
    ],
  },
  {
    id: "layout",
    title: "Tata letak",
    description: "Ruang di atas, bawah, dan antar-elemen.",
    fields: [
      { group: "layout", key: "paddingTop", kind: "number", label: "Padding atas (px)", min: 0, max: 400 },
      { group: "layout", key: "paddingBottom", kind: "number", label: "Padding bawah (px)", min: 0, max: 400 },
      { group: "layout", key: "elementGap", kind: "number", label: "Jarak antar-elemen (px)", min: 0, max: 96 },
    ],
  },
  {
    id: "button",
    title: "Tombol dan tautan",
    description: "Berlaku untuk tombol aksi di dalam section ini.",
    fields: [
      { group: "button", key: "backgroundColor", kind: "color", label: "Warna latar", placeholder: "#6b5144" },
      { group: "button", key: "textColor", kind: "color", label: "Warna teks", placeholder: "#ffffff" },
      { group: "button", key: "borderColor", kind: "color", label: "Warna border", placeholder: "#6b5144" },
      { group: "button", key: "borderRadius", kind: "number", label: "Radius (px)", min: 0, max: 48 },
      { group: "button", key: "fontSize", kind: "number", label: "Ukuran teks (px)", min: 10, max: 32 },
      { group: "button", key: "paddingX", kind: "number", label: "Padding horizontal (px)", min: 0, max: 64 },
      { group: "button", key: "paddingY", kind: "number", label: "Padding vertikal (px)", min: 0, max: 40 },
    ],
  },
  {
    id: "image",
    title: "Gambar",
    description: "Terutama memengaruhi galeri.",
    fields: [
      { group: "image", key: "aspectRatio", kind: "select", label: "Rasio", fallback: "square", options: [
        { value: "square", label: "Persegi (1:1)" }, { value: "portrait", label: "Portrait (3:4)" }, { value: "landscape", label: "Landscape (4:3)" },
      ] },
      { group: "image", key: "objectFit", kind: "select", label: "Object fit", fallback: "cover", options: [
        { value: "cover", label: "Cover" }, { value: "contain", label: "Contain" },
      ] },
      { group: "image", key: "objectPosition", kind: "select", label: "Posisi gambar", fallback: "center", options: [
        { value: "center", label: "Tengah" }, { value: "top", label: "Atas" }, { value: "bottom", label: "Bawah" },
        { value: "left", label: "Kiri" }, { value: "right", label: "Kanan" },
      ] },
      { group: "image", key: "borderRadius", kind: "number", label: "Radius (px)", min: 0, max: 48 },
    ],
  },
  {
    id: "decoration",
    title: "Ikon, divider, dan ornamen",
    description: "Elemen dekoratif opsional.",
    fields: [
      { group: "icon", key: "color", kind: "color", label: "Warna ikon", placeholder: "#8b7565" },
      { group: "icon", key: "size", kind: "number", label: "Ukuran ikon (px)", min: 12, max: 96 },
      { group: "icon", key: "strokeWidth", kind: "number", label: "Garis ikon", min: 1, max: 4, step: 0.25 },
      { group: "divider", key: "color", kind: "color", label: "Warna divider", placeholder: "#8b7565" },
      { group: "divider", key: "style", kind: "select", label: "Gaya divider", fallback: "solid", options: [
        { value: "solid", label: "Solid" }, { value: "dashed", label: "Putus-putus" }, { value: "dotted", label: "Titik-titik" },
      ] },
      { group: "divider", key: "thickness", kind: "number", label: "Tebal divider (px)", min: 1, max: 8 },
      { group: "divider", key: "width", kind: "number", label: "Lebar divider (%)", min: 10, max: 100 },
      { group: "divider", key: "spacing", kind: "number", label: "Jarak divider (px)", min: 0, max: 160 },
      { group: "ornament", key: "color", kind: "color", label: "Warna ornamen", placeholder: "#8b7565" },
      { group: "ornament", key: "position", kind: "select", label: "Posisi ornamen", fallback: "top-right", options: [
        { value: "top-left", label: "Atas kiri" }, { value: "top-right", label: "Atas kanan" },
        { value: "bottom-left", label: "Bawah kiri" }, { value: "bottom-right", label: "Bawah kanan" },
      ] },
      { group: "ornament", key: "size", kind: "number", label: "Ukuran ornamen (px)", min: 8, max: 160 },
      { group: "ornament", key: "opacity", kind: "number", label: "Opacity ornamen", hint: "0 sampai 1", min: 0, max: 1, step: 0.05 },
    ],
  },
];

export const SECTION_TYPES = [
  { value: "cover", label: "Cover", description: "Halaman pembuka dengan nama mempelai." },
  { value: "opening", label: "Pembuka", description: "Salam dan kalimat pembuka." },
  { value: "quote", label: "Kutipan", description: "Ayat, doa, atau kutipan." },
  { value: "couple", label: "Mempelai", description: "Profil kedua mempelai." },
  { value: "event", label: "Acara", description: "Akad, resepsi, tanggal, dan jam." },
  { value: "location", label: "Lokasi", description: "Alamat dan peta." },
  { value: "gallery", label: "Galeri", description: "Kumpulan foto." },
  { value: "rsvp", label: "RSVP", description: "Konfirmasi kehadiran tamu." },
  { value: "gift", label: "Hadiah", description: "Rekening atau alamat hadiah." },
  { value: "closing", label: "Penutup", description: "Ucapan terima kasih." },
] as const;

export function sectionTypeLabel(type: string): string {
  return SECTION_TYPES.find((item) => item.value === type)?.label ?? type;
}

/** Next free key for a new section of this type: `event`, then `event-2`, `event-3`, ... */
export function nextSectionKey(type: string, existing: string[]): string {
  if (!existing.includes(type)) return type;
  let n = 2;
  while (existing.includes(`${type}-${n}`)) n += 1;
  return `${type}-${n}`;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Parses a JSON object, or returns null when it is invalid or not an object. */
export function parseContent(json: string): SectionContent | null {
  try {
    const value: unknown = JSON.parse(json);
    return isRecord(value) ? value : null;
  } catch {
    return null;
  }
}

export function readDesignValue(content: SectionContent, group: DesignGroup, key: string): unknown {
  const design = content.design;
  if (!isRecord(design)) return undefined;
  const bucket = design[group];
  return isRecord(bucket) ? bucket[key] : undefined;
}

/**
 * Returns new content with one design value set. `undefined`, `""` or NaN remove the key,
 * and empty groups (or an empty `design`) are dropped so unset fields fall back to defaults.
 */
export function writeDesignValue(content: SectionContent, group: DesignGroup, key: string, value: unknown): SectionContent {
  const design = isRecord(content.design) ? content.design : {};
  const bucket = isRecord(design[group]) ? { ...(design[group] as Record<string, unknown>) } : {};
  const empty = value === undefined || value === "" || (typeof value === "number" && Number.isNaN(value));
  if (empty) delete bucket[key];
  else bucket[key] = value;

  const nextDesign: Record<string, unknown> = { ...design };
  if (Object.keys(bucket).length) nextDesign[group] = bucket;
  else delete nextDesign[group];

  const { design: _previous, ...rest } = content;
  void _previous;
  return Object.keys(nextDesign).length ? { ...rest, design: nextDesign } : rest;
}

export function clearDesign(content: SectionContent): SectionContent {
  const { design: _design, ...rest } = content;
  void _design;
  return rest;
}

/** Number of design values currently set, optionally limited to one panel's fields. */
export function countDesignValues(content: SectionContent, fields?: DesignField[]): number {
  if (fields) return fields.filter((field) => readDesignValue(content, field.group, field.key) !== undefined).length;
  const design = content.design;
  if (!isRecord(design)) return 0;
  return Object.values(design).reduce<number>((total, bucket) => total + (isRecord(bucket) ? Object.keys(bucket).length : 0), 0);
}
