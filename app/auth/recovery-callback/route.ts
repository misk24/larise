import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=invalid_recovery_link", url.origin),
    );
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/reset-password", url.origin));

  const supabase = createServerClient(
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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Do not log the one-time code or other URL credentials.
    console.error("Password recovery code exchange failed:", error.message);
    return NextResponse.redirect(
      new URL("/forgot-password?error=invalid_recovery_link", url.origin),
    );
  }

  return response;
}
