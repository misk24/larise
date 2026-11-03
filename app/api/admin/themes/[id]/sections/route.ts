import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import { z } from "zod";

const sectionSchema = z.object({
  section_key: z.string().trim().min(1).max(80).regex(/^[a-z][a-z0-9_-]*$/),
  section_type: z.enum([
    "cover", "hero", "quote", "event", "countdown", "story",
    "gallery", "gift", "rsvp", "wish", "closing", "footer",
  ]),
  default_content: z.record(z.string(), z.unknown()),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;

  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  }

  const parsed = sectionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Data section tidak valid." }, { status: 400 });
  }

  if (JSON.stringify(parsed.data.default_content).length > 65536) {
    return NextResponse.json({ error: "Konten section maksimal 64 KB." }, { status: 413 });
  }

  const { data: last, error: positionError } = await supabase
    .from("theme_sections")
    .select("position")
    .eq("theme_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    return NextResponse.json({ error: "Urutan section tidak dapat ditentukan." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("theme_sections")
    .insert({
      theme_id: id,
      ...parsed.data,
      position: (last?.position ?? 0) + 1,
    })
    .select("id,theme_id,section_key,section_type,default_content,position")
    .single();

  if (error) {
    return NextResponse.json({ error: "Section gagal dibuat." }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
