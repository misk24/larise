import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";

const idSchema = z.string().uuid();
const themeSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).nullable(),
  thumbnail_url: z.string().url().max(2048).nullable(),
  preview_url: z.string().url().max(2048).nullable(),
  price: z.number().int().min(0).max(1_000_000_000),
  category: z.enum(["elegant", "minimalist", "traditional", "modern", "rustic", "floral"]),
  features: z.array(z.string().trim().min(1).max(100)).max(20),
  is_premium: z.boolean(),
});
const statusSchema = z.object({ is_active: z.boolean() });

async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  return idSchema.safeParse(id).success ? id : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const id = await getId(params);
  if (!id) return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  const { data, error } = await supabase.from("themes")
    .select("id,name,slug,description,thumbnail_url,preview_url,price,category,features,is_active,is_premium")
    .eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Tema gagal dimuat." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const id = await getId(params);
  if (!id) return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });

  const body = await request.json().catch(() => null);
  const parsed = themeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tema tidak valid." }, { status: 400 });

  const payload = {
    ...parsed.data,
    description: parsed.data.description || null,
    thumbnail_url: parsed.data.thumbnail_url || null,
    preview_url: parsed.data.preview_url || null,
    features: parsed.data.features.filter(Boolean),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("themes").update(payload).eq("id", id)
    .select("id,name,slug,description,thumbnail_url,preview_url,price,category,features,is_active,is_premium").maybeSingle();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Slug tema sudah digunakan." }, { status: 409 });
    return NextResponse.json({ error: "Konfigurasi tema gagal disimpan." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const id = await getId(context.params);
  if (!id) return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status tema tidak valid." }, { status: 400 });
  const { data, error } = await supabase.from("themes").update({ is_active: parsed.data.is_active, updated_at: new Date().toISOString() })
    .eq("id", id).select("id,name,is_active").maybeSingle();
  if (error) return NextResponse.json({ error: "Status tema gagal diperbarui." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;
  const id = await getId(params);
  if (!id) return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });

  const { count, error: countError } = await supabase.from("invitations")
    .select("id", { count: "exact", head: true }).eq("theme_id", id);
  if (countError) return NextResponse.json({ error: "Penggunaan tema tidak dapat diverifikasi. Tema tidak dihapus." }, { status: 500 });
  if ((count ?? 0) > 0) return NextResponse.json({ error: "Tema masih digunakan undangan. Nonaktifkan tema agar tidak dipilih pengguna baru." }, { status: 409 });

  const { data, error } = await supabase.from("themes").delete().eq("id", id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Tema gagal dihapus. Periksa relasi data yang menggunakannya." }, { status: 409 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true });
}
