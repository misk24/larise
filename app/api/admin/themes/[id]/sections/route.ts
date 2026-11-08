import { getAdminApiContext } from "@/lib/admin/authorization";
import { validateSectionDesign } from "@/lib/validation/section-design";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().uuid();
const sectionSchema = z.object({
  section_key: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z][a-z0-9_-]*$/),
  section_type: z.enum([
    "cover",
    "opening",
    "quote",
    "couple",
    "event",
    "location",
    "gallery",
    "rsvp",
    "gift",
    "closing",
  ]),
  default_content: z.record(z.string(), z.unknown()),
  is_required: z.boolean(),
  is_visible: z.boolean(),
});
const contentIsSafe = (value: unknown) => JSON.stringify(value).length <= 65536;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const { id } = await params;
  if (!idSchema.safeParse(id).success)
    return NextResponse.json(
      { error: "ID tema tidak valid." },
      { status: 400 },
    );
  const parsed = sectionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data section tidak valid." },
      { status: 400 },
    );
  if (!contentIsSafe(parsed.data.default_content))
    return NextResponse.json(
      { error: "Konten section maksimal 64 KB." },
      { status: 413 },
    );
  const designValidation = validateSectionDesign(parsed.data.default_content);
  if (!designValidation.success)
    return NextResponse.json(
      {
        error:
          designValidation.error.issues[0]?.message ??
          "Konfigurasi desain tidak valid.",
      },
      { status: 400 },
    );

  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (themeError)
    return NextResponse.json(
      { error: "Tema gagal diverifikasi." },
      { status: 500 },
    );
  if (!theme)
    return NextResponse.json(
      { error: "Tema tidak ditemukan." },
      { status: 404 },
    );
  const { data: last, error: positionError } = await supabase
    .from("theme_sections")
    .select("position")
    .eq("theme_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (positionError)
    return NextResponse.json(
      { error: "Urutan section tidak dapat ditentukan." },
      { status: 500 },
    );

  const { data, error } = await supabase
    .from("theme_sections")
    .insert({
      theme_id: id,
      ...parsed.data,
      position: (last?.position ?? -1) + 1,
    })
    .select(
      "id,theme_id,section_key,section_type,position,default_content,is_required,is_visible",
    )
    .single();
  if (error) {
    if (error.code === "23505")
      return NextResponse.json(
        { error: "Section dengan key tersebut sudah ada pada tema ini." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Section gagal dibuat." },
      { status: 500 },
    );
  }
  return NextResponse.json(data, { status: 201 });
}
