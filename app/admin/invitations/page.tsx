import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvitationsTable, type AdminInvitationRow } from "@/components/admin/tables/invitations/invitations-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";

type SearchParams = Promise<{ q?: string; status?: string; page?: string; size?: string; sort?: string; direction?: string }>;
const statuses = ["draft", "published", "unpublished"] as const;

function sanitizeSearch(value: string | undefined) {
  return value?.trim().slice(0, 80).replace(/[,%_().\\]/g, " ").replace(/\s+/g, " ") ?? "";
}

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminInvitationsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = sanitizeSearch(params.q);
  const status = statuses.find((value) => value === params.status) ?? "";
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "status", "slug"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  let request = supabase
    .from("invitations")
    .select("id,groom_name,bride_name,slug,status,created_at,profiles(full_name,email),themes(name)", { count: "exact" })
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  if (status) request = request.eq("status", status);
  if (query) request = request.or(`slug.ilike.%${query}%,groom_name.ilike.%${query}%,bride_name.ilike.%${query}%`);
  const { data, count, error } = await request;
  const total = count ?? 0;
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / pageSize)));
  if (!error && page !== requestedPage) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (status) next.set("status", status);
    next.set("page", String(page));
    next.set("size", String(pageSize));
    next.set("sort", sort);
    next.set("direction", direction);
    redirect(`/admin/invitations?${next.toString()}`);
  }

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Undangan</h1>
        <p className="text-muted-foreground">Cari dan pantau undangan yang dibuat pengguna.</p>
      </header>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Undangan</CardTitle>
          <CardDescription>{error ? "Jumlah undangan tidak dapat dimuat." : `${total.toLocaleString("id-ID")} undangan`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/invitations" className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input type="hidden" name="q" value={query} />
            <label htmlFor="invitation-status" className="text-sm text-muted-foreground">Status</label>
            <select id="invitation-status" name="status" defaultValue={status} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Semua status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
            <button type="submit" className="h-10 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground">Terapkan filter</button>
          </form>
          {error ? <p role="alert" className="py-8 text-center text-sm text-destructive">Data undangan gagal dimuat. Periksa izin baca admin dan relasi database.</p> : (
            <InvitationsTable data={(data ?? []) as AdminInvitationRow[]} page={page} pageSize={pageSize} rowCount={total} sort={sort} direction={direction} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
