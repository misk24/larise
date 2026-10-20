import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function destinationForRole(role: string | null | undefined) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createClient();
  const admin = createAdminClient();
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const intent = url.searchParams.get("intent") ?? "login";

  if (!code) return NextResponse.redirect(new URL("/login?error=oauth", url.origin));

  // Persist recovery cookies on the exact redirect response. This avoids losing
  // the newly exchanged session when the callback returns a redirect response.
  if (type === "recovery") {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(new URL("/reset-password", url.origin));
    const recoveryClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );
    const { error } = await recoveryClient.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Password recovery code exchange failed:", error.message);
      return NextResponse.redirect(new URL("/forgot-password?error=invalid_recovery_link", url.origin));
    }
    return response;
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) {
    return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
  }

  const user = data.user;
  if (!user.email) return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
  const email = user.email.trim().toLowerCase();
  const provider = type === "verify" ? "email" :
    (user.app_metadata?.provider === "google" || user.identities?.some(identity => identity.provider === "google")
      ? "google" : user.app_metadata?.provider ?? "email");

  const { data: profile, error: lookupError } = await admin
    .from("profiles").select("id, provider, role").ilike("email", email).maybeSingle();

  if (lookupError) {
    console.error("OAuth profile lookup failed:", lookupError);
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=profile_creation", url.origin));
  }

  // Email verification may only complete the account that initiated registration.
  // A provider mismatch must never silently attach a second identity to the same email.
  if (profile && (profile.provider !== provider || profile.id !== user.id)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(
      `/login?error=provider_mismatch&provider=${encodeURIComponent(profile.provider)}`, url.origin));
  }

  // If registration via Google is started for an existing Google account,
  // treat it as sign-in instead of attempting to create a duplicate profile.
  // Provider mismatches are rejected above so this cannot bypass the one-provider rule.
  if (intent === "signup" && profile && profile.provider === "google" && profile.id === user.id) {
    return NextResponse.redirect(new URL(destinationForRole(profile.role), url.origin));
  }

  if (!profile && intent !== "signup" && type !== "verify") {
    // The login button must not silently create a new account.
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=account_not_found", url.origin));
  }

  if (!profile) {
    const { error: insertError } = await admin.from("profiles").insert({
      id: user.id, email, provider, role: "user",
    });
    if (insertError) {
      console.error("OAuth profile creation failed:", insertError);
      await admin.auth.admin.deleteUser(user.id);
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=profile_creation", url.origin));
    }
  }

  // Email/password users may be signed in after verification, but Google accounts
  // only arrive here after the OAuth identity has been confirmed by Supabase.
  const role = profile?.role ?? "user";
  return NextResponse.redirect(new URL(destinationForRole(role), url.origin));
}
