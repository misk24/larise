import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";

const createThemeSchema = z.object({
  name: z.string().trim().min(2, "Nama tema minimal 2 karakter.").max(80, "Nama tema maksimal 80 karakter."),
});

export async function POST(request: Request) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;

  const parsed = createThemeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tema tidak valid." }, { status: 400 });
  }

  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  if (!slug) {
    return NextResponse.json({ error: "Nama tema tidak dapat digunakan sebagai slug." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("themes")
    .insert({ name: parsed.data.name, slug, is_active: false })
    .select("id,name,slug,is_active")
    .single();

  if (error) {
    return NextResponse.json({ error: "Tema gagal dibuat. Pastikan nama atau slug belum digunakan." }, { status: 409 });
  }

  return NextResponse.json(data, { status: 201 });
}
