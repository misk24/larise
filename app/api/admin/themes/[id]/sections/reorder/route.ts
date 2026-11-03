import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ section_ids: z.array(z.string().uuid()).min(1).max(50) }).refine((value) => new Set(value.section_ids).size === value.section_ids.length, "ID section duplikat.");
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Urutan section tidak valid." }, { status: 400 });
  const { data, error } = await supabase.rpc("admin_reorder_theme_sections", { p_theme_id: id, p_section_ids: parsed.data.section_ids });
  if (error) return NextResponse.json({ error: "Urutan section gagal disimpan. Pastikan migration theme builder sudah diterapkan." }, { status: 500 });
  return NextResponse.json({ success: true, sections: data });
}
