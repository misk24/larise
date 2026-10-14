import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = z.object({ name: z.string().trim().min(2).max(80) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Nama tema wajib 2-80 karakter" }, { status: 400 });
  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  const { data, error } = await supabase.from("themes").insert({ name: parsed.data.name, slug, is_active: false }).select().single();
  if (error) return NextResponse.json({ error: "Gagal membuat tema. Periksa apakah nama/slug sudah digunakan." }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}