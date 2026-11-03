import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAdminApiContext() {
  const sessionClient = await createClient();
  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) {
    return { supabase: sessionClient, response: NextResponse.json({ error: "Sesi login tidak valid." }, { status: 401 }) };
  }

  // The role is read from the server-controlled profile row, never user-editable metadata.
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (profileError) {
    return { supabase: sessionClient, response: NextResponse.json({ error: "Akses admin belum dapat diverifikasi." }, { status: 500 }) };
  }
  if (profile?.role !== "admin") {
    return { supabase: sessionClient, response: NextResponse.json({ error: "Akses ditolak." }, { status: 403 }) };
  }
  return { supabase: adminClient, response: null };
}
