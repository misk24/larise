import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const supabase = await createClient();

  // 1. pastikan user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. ambil role dari profiles
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Role fetch error:", error);
    redirect("/login");
  }

  // 3. redirect final berdasarkan role
  if (profile.role === "admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
