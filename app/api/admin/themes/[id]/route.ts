import { getAdminApiContext } from "@/lib/admin/authorization";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().uuid();
const statusSchema = z.object({ is_active: z.boolean() });

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;

  const { id } = await params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("themes")
    .select("id,name,slug,is_active,category,price")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Tema gagal dimuat." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;

  const { id } = await params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Status tema tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("themes")
    .update({ is_active: parsed.data.is_active })
    .eq("id", id)
    .select("id,name,is_active")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Status tema gagal diperbarui." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await getAdminApiContext();
  if (response) return response;

  const { id } = await params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID tema tidak valid." }, { status: 400 });
  }

  const { count, error: countError } = await supabase
    .from("invitations")
    .select("id", { count: "exact", head: true })
    .eq("theme_id", id);

  if (countError) {
    return NextResponse.json({ error: "Penggunaan tema tidak dapat diverifikasi. Tema tidak dihapus." }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Tema masih digunakan undangan. Nonaktifkan tema agar tidak dipilih pengguna baru." },
      { status: 409 },
    );
  }

  const { data: deleted, error } = await supabase
    .from("themes")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Tema gagal dihapus. Periksa kembali relasi data yang menggunakannya." }, { status: 409 });
  }
  if (!deleted) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ success: true });
}
