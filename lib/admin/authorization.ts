import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function getAdminApiContext() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      supabase,
      response: NextResponse.json({ error: "Sesi login tidak valid." }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      supabase,
      response: NextResponse.json({ error: "Akses admin belum dapat diverifikasi." }, { status: 500 }),
    };
  }

  if (profile?.role !== "admin") {
    return {
      supabase,
      response: NextResponse.json({ error: "Akses ditolak." }, { status: 403 }),
    };
  }

  return { supabase, response: null };
}
