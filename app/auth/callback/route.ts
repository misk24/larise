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
  const email = user.email!.toLowerCase()
  const provider = type === "verify"
    ? "email"
    : (user.identities?.[0]?.provider || user.app_metadata?.provider || "google")

  // 2. cek apakah email sudah ada di profiles (use admin to bypass RLS)
  const { data: profile } = await admin
    .from("profiles")
    .select("provider")
    .eq("email", email)
    .maybeSingle()

  // Debug logging to help trace provider mismatches in dev
  // try {
    // eslint-disable-next-line no-console
    // console.log("[auth/callback] email:", email, "provider:", provider, "profile:", profile)
  // } catch (e) {
    // ignore
  // }

  // 3. konflik provider - if this is NOT an email verification callback,
  //    and the stored profile was created with the email provider, block OAuth sign-ins.
  //    This is a strict safety check to prevent signing in via Google when the profile
  //    was originally registered via email/password.
  if (type !== "verify" && profile && profile.provider === "email") {
    await supabase.auth.signOut()
    return NextResponse.redirect(
      new URL(
        `/login?error=provider_mismatch&provider=${profile.provider}`,
        request.url
      )
    )
  }

  // 4. email sudah ada dengan provider sama (login, bukan signup)
  if (profile) {
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
