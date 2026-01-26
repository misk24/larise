import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type") // "verify" for email, undefined for OAuth

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url))
  }

  // 1. exchange code → session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url))
  }

  const user = data.user
  const email = user.email!
  const provider = type === "verify" ? "email" : (user.app_metadata.provider || "google")

  // 2. cek apakah email sudah ada di profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("provider")
    .eq("email", email)
    .maybeSingle()

  // 3. konflik provider - email sudah terdaftar dengan provider berbeda
  if (profile && profile.provider !== provider) {
    await supabase.auth.signOut()
    return NextResponse.redirect(
      new URL(
        `/login?error=provider_mismatch&provider=${profile.provider}`,
        request.url
      )
    )
  }

  // 4. email sudah ada dengan provider sama (login, bukan signup)
  if (profile && profile.provider === provider) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 5. user baru dengan OAuth → buat profile
  if (!profile && provider === "google") {
    const { error: profileError } = await admin.from("profiles").insert({
      id: user.id,
      email: email,
      provider: "google",
      role: "user",
    })

    if (profileError) {
      console.error("Profile creation failed:", profileError)
      await supabase.auth.signOut()
      return NextResponse.redirect(
        new URL("/login?error=profile_creation", request.url)
      )
    }
  }

  // 6. untuk email verification, profile sudah dibuat di signUp
  // tinggal redirect ke dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url))
}
