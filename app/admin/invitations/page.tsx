import { BackendPageHeader } from "@/components/backend/backend-ui";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTableError } from "@/components/admin/table-states";
import { InvitationsTable, type AdminInvitationRow } from "@/components/admin/tables/invitations/invitations-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { normalizeAdminSearchTerm, sanitizeAdminSearch } from "@/lib/utils/admin-search";

type SearchParams = Promise<{ q?: string; status?: string; page?: string; size?: string; sort?: string; direction?: string }>;
const statuses = ["draft", "published", "unpublished"] as const;

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminInvitationsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const query = sanitizeAdminSearch(params.q);
  const normalizedQuery = normalizeAdminSearchTerm(query);
  const status = statuses.find((value) => value === params.status) ?? "";
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "status", "slug"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  // The database view joins invitation, owner, and theme fields before
  // filtering. This avoids multiple 10k-limited queries and huge ID unions.
  let request = supabase
    .from("admin_invitation_search")
    .select("id,groom_name,bride_name,slug,status,created_at,owner_name,owner_email,theme_name", { count: "exact" })
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  if (status) request = request.eq("status", status);
  if (normalizedQuery) {
    request = request.or([
      "search_slug",
      "search_groom_name",
      "search_bride_name",
      "search_owner_name",
      "search_owner_email",
      "search_theme_name",
      "search_theme_slug",
    ].map((field) => `${field}.ilike.%${normalizedQuery}%`).join(","));
  }

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
      <BackendPageHeader title="Kelola Undangan" description="Cari dan pantau undangan yang dibuat pengguna." />
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Undangan</CardTitle>
          <CardDescription>{error ? "Jumlah undangan tidak dapat dimuat." : `${total.toLocaleString("id-ID")} undangan`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <AdminTableError title="Undangan gagal dimuat" description="Periksa koneksi database dan migration pencarian admin." />
          ) : (
            <InvitationsTable
              data={(data ?? []) as AdminInvitationRow[]}
              page={page}
              pageSize={pageSize}
              rowCount={total}
              sort={sort}
              direction={direction}
              filters={[{ key: "status", label: "Status", value: status, options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }, { label: "Unpublished", value: "unpublished" }] }]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
