import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTableError } from "@/components/admin/table-states";
import { UsersTable, type AdminUserRow } from "@/components/admin/tables/users/users-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { sanitizeAdminSearch } from "@/lib/utils/admin-search";

type SearchParams = Promise<{ q?: string; page?: string; size?: string; sort?: string; direction?: string }>;

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = sanitizeAdminSearch(params.q);
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "full_name", "email"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  let request = supabase
    .from("profiles")
    .select("id,full_name,email,created_at,invitations(count)", { count: "exact" })
    .eq("role", "user")
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  // All user-facing text columns in this table are searchable.
  if (query) request = request.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  const { data, count, error } = await request;
  const total = count ?? 0;
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / pageSize)));
  if (!error && page !== requestedPage) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    next.set("page", String(page));
    next.set("size", String(pageSize));
    next.set("sort", sort);
    next.set("direction", direction);
    redirect(`/admin/users?${next.toString()}`);
  }

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Pengguna</h1>
        <p className="text-muted-foreground">Cari dan tinjau akun pengguna yang terdaftar di LARISÉ.</p>
      </header>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>{error ? "Jumlah pengguna tidak dapat dimuat." : `${total.toLocaleString("id-ID")} pengguna terdaftar`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? <AdminTableError title="Pengguna gagal dimuat" description="Periksa izin baca admin pada database." /> : (
            <UsersTable data={(data ?? []) as AdminUserRow[]} page={page} pageSize={pageSize} rowCount={total} sort={sort} direction={direction} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
