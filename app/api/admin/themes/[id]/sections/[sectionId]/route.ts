import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validateSectionDesign } from "@/lib/validation/section-design";

const uuid = z.string().uuid();
const sectionSchema = z.object({
  section_key: z.string().trim().min(1).max(80).regex(/^[a-z][a-z0-9_-]*$/),
  section_type: z.enum(["cover", "opening", "quote", "couple", "event", "location", "gallery", "rsvp", "gift", "closing"]),
  default_content: z.record(z.string(), z.unknown()),
  is_required: z.boolean(),
  is_visible: z.boolean(),
});
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const { id, sectionId } = await params;
  if (!uuid.safeParse(id).success || !uuid.safeParse(sectionId).success) return NextResponse.json({ error: "ID tema atau section tidak valid." }, { status: 400 });
  const parsed = sectionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data section tidak valid." }, { status: 400 });
  if (JSON.stringify(parsed.data.default_content).length > 65536) return NextResponse.json({ error: "Konten section maksimal 64 KB." }, { status: 413 });
  const designValidation = validateSectionDesign(parsed.data.default_content);
  if (!designValidation.success) return NextResponse.json({ error: designValidation.error.issues[0]?.message ?? "Konfigurasi desain tidak valid." }, { status: 400 });
  const { data, error } = await supabase.from("theme_sections").update({ ...parsed.data })
    .eq("id", sectionId).eq("theme_id", id)
    .select("id,theme_id,section_key,section_type,position,default_content,is_required,is_visible").maybeSingle();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Section key sudah digunakan pada tema ini." }, { status: 409 });
    return NextResponse.json({ error: "Section gagal diperbarui." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Section tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const { id, sectionId } = await params;
  if (!uuid.safeParse(id).success || !uuid.safeParse(sectionId).success) return NextResponse.json({ error: "ID tema atau section tidak valid." }, { status: 400 });
  const { data, error } = await supabase.from("theme_sections").delete().eq("id", sectionId).eq("theme_id", id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Section gagal dihapus." }, { status: 409 });
  if (!data) return NextResponse.json({ error: "Section tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true });
}
