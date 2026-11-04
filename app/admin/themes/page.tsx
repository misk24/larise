import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTableError } from "@/components/admin/table-states";
import { ThemesTable, type AdminThemeRow } from "@/components/admin/tables/themes/themes-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { postgrestIlikePattern, sanitizeAdminSearch } from "@/lib/utils/admin-search";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; page?: string; size?: string; sort?: string; direction?: string }>;

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminThemesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = sanitizeAdminSearch(params.q);
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "name", "category", "price", "is_active"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  let request = supabase
    .from("themes")
    .select("id,name,slug,category,price,is_active,created_at", { count: "exact" })
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  if (query) {
    const pattern = postgrestIlikePattern(query);
    const clauses = [
      `name.ilike.${pattern}`,
      `slug.ilike.${pattern}`,
      `category.ilike.${pattern}`,
    ];
    const normalized = query.toLocaleLowerCase("id-ID");
    if (["aktif", "active", "true", "yes"].includes(normalized)) clauses.push("is_active.eq.true");
    if (["nonaktif", "inactive", "false", "no"].includes(normalized)) clauses.push("is_active.eq.false");
    if (/^\d+(\.\d+)?$/.test(query)) clauses.push(`price.eq.${query}`);
    request = request.or(clauses.join(","));
  }
  const { data, error, count } = await request;
  const total = count ?? 0;
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / pageSize)));

  if (!error && page !== requestedPage) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    next.set("page", String(page));
    next.set("size", String(pageSize));
    next.set("sort", sort);
    next.set("direction", direction);
    redirect(`/admin/themes?${next.toString()}`);
  }

  return (
    <div className="backend-content space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Tema</h1>
          <p className="text-muted-foreground">Kelola tema undangan yang tersedia untuk pengguna.</p>
        </div>
        <Button asChild><Link href="/admin/themes/create">Buat Tema</Link></Button>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Tema</CardTitle>
          <CardDescription>{error ? "Jumlah tema tidak dapat dimuat." : `Total ${total.toLocaleString("id-ID")} tema`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <AdminTableError title="Tema gagal dimuat" description="Periksa izin baca admin pada database." />
          ) : (
            <ThemesTable
              data={(data ?? []) as AdminThemeRow[]}
              page={page}
              pageSize={pageSize}
              rowCount={total}
              sort={sort}
              direction={direction}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
