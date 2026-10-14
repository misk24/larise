import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { supabase, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { supabase, response: null };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  const { data, error } = await supabase.from("themes").select("id,name,is_active,slug,category,price").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Tema tidak ditemukan" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await requireAdmin();
  if (response) return response;
  const parsed = z.object({ is_active: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Status tema tidak valid" }, { status: 400 });
  const { id } = await params;
  const { data, error } = await supabase.from("themes").update({ is_active: parsed.data.is_active }).eq("id", id).select("id,name,is_active").maybeSingle();
  if (error) return NextResponse.json({ error: "Gagal memperbarui status tema" }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Tema tidak ditemukan atau akses ditolak" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  const { count, error: countError } = await supabase.from("invitations").select("id", { count: "exact", head: true }).eq("theme_id", id);
  if (countError) return NextResponse.json({ error: "Tidak dapat memverifikasi penggunaan tema" }, { status: 500 });
  if ((count ?? 0) > 0) return NextResponse.json({ error: "Tema masih digunakan undangan. Nonaktifkan tema agar tidak dipilih pengguna baru." }, { status: 409 });
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menghapus tema" }, { status: 400 });
  return NextResponse.json({ success: true });
}