import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function destinationForRole(role: string | null | undefined) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const intent = url.searchParams.get("intent") ?? "login";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", url.origin));
  }

  // Attach refreshed session cookies to the redirect response, not only the
  // request cookie store, so the browser receives the authenticated session.
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/login", url.origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) {
    console.error("Auth callback code exchange failed:", error?.message ?? "Missing user email");
    response.headers.set(
      "Location",
      new URL(
        type === "verify" ? "/login?error=verification_failed" : "/login?error=oauth",
        url.origin,
      ).toString(),
    );
    return response;
  }

  const user = data.user;
  const email = user.email?.trim().toLowerCase();
  if (!email) {
    await supabase.auth.signOut();
    response.headers.set("Location", new URL("/login?error=oauth", url.origin).toString());
    return response;
  }
  const provider =
    type === "verify"
      ? "email"
      : user.app_metadata?.provider === "google" ||
          user.identities?.some((identity) => identity.provider === "google")
        ? "google"
        : user.app_metadata?.provider ?? "email";

  const admin = createAdminClient();
  const { data: profile, error: lookupError } = await admin
    .from("profiles")
    .select("id, provider, role")
    .ilike("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("Auth callback profile lookup failed:", lookupError);
    await supabase.auth.signOut();
    response.headers.set(
      "Location",
      new URL("/login?error=profile_lookup", url.origin).toString(),
    );
    return response;
  }

  // The Auth user ID is the account identity. A stale provider label on an
  // existing profile must not block a valid session for that same user.
  // Still reject a different Auth user with the same email: matching email
  // alone is not sufficient proof that two separate accounts may be linked.
  if (profile && profile.id !== user.id) {
    await supabase.auth.signOut();
    response.headers.set(
      "Location",
      new URL(
        `/login?error=provider_mismatch&provider=${encodeURIComponent(profile.provider ?? "email")}`,
        url.origin,
      ).toString(),
    );
    return response;
  }

  // A login attempt without a profile is not an invitation to create one.
  // Users can register through the signup flow; email verification is allowed
  // to finish the profile for the account created during registration.
  if (!profile && intent !== "signup" && type !== "verify") {
    await supabase.auth.signOut();
    response.headers.set(
      "Location",
      new URL("/login?error=account_not_found", url.origin).toString(),
    );
    return response;
  }

  if (!profile) {
    const { error: insertError } = await admin.from("profiles").insert({
      id: user.id,
      email,
      provider,
      role: "user",
    });

    if (insertError) {
      console.error("Auth callback profile creation failed:", insertError);
      await supabase.auth.signOut();
      response.headers.set(
        "Location",
        new URL("/login?error=profile_creation", url.origin).toString(),
      );
      return response;
    }
  }

  response.headers.set(
    "Location",
    new URL(destinationForRole(profile?.role), url.origin).toString(),
  );
  return response;
}
