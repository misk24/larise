import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getClaims validates the signed token and refreshes the session cookies when needed.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const pathname = request.nextUrl.pathname;
  const isProtected = ["/dashboard", "/admin"].some(route => pathname === route || pathname.startsWith(route + "/"));

  if (isProtected && !claims) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.searchParams.set("redirect", pathname);
    return NextResponse.redirect(target);
  }

  // Authenticated visitors should not loop back into login/register pages.
  const isAuthPage = ["/login", "/register", "/registrasi"].includes(pathname);
  if (isAuthPage && claims) {
    const target = request.nextUrl.clone();
    target.pathname = "/dashboard";
    return NextResponse.redirect(target);
  }

  return response;
}
