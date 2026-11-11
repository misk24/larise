import { createServerClient } from "@supabase/ssr";

// Cookie-less anonymous client for public, cacheable reads (theme catalogue, previews).
// It never reads or writes the visitor's session, so results are safe to cache and share.
export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
}
