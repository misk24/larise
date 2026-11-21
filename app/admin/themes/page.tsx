import { BackendPageHeader, BackendStatCard, BackendStatGrid } from "@/components/backend/backend-ui";
import { redirect } from "next/navigation";
import { AdminTableError } from "@/components/admin/table-states";
import { ThemesTable, type AdminThemeRow } from "@/components/admin/tables/themes/themes-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { postgrestIlikePattern, sanitizeAdminSearch } from "@/lib/utils/admin-search";
import { THEME_CATEGORIES } from "@/lib/theme-categories";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon, CircleSlashIcon, PaletteIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; status?: string; category?: string; page?: string; size?: string; sort?: string; direction?: string }>;

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminThemesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = sanitizeAdminSearch(params.q);
  const status = (["active", "inactive"] as const).find((value) => value === params.status) ?? "";
  const category = THEME_CATEGORIES.find((item) => item.value === params.category)?.value ?? "";
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "name", "category", "price", "is_active"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  let request = supabase
    .from("themes")
    .select("id,name,slug,category,price,is_active,is_premium,thumbnail_url,created_at,theme_sections(count)", { count: "exact" })
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  if (status) request = request.eq("is_active", status === "active");
  if (category) request = request.eq("category", category);
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

  // Key figures cover every theme, independent of the search and filters below.
  const countThemes = () => supabase.from("themes").select("id", { count: "exact", head: true });
  const [{ data, error, count }, all, active, premium] = await Promise.all([
    request,
    countThemes(),
    countThemes().eq("is_active", true),
    countThemes().eq("is_premium", true),
  ]);
  const total = count ?? 0;
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / pageSize)));

  if (!error && page !== requestedPage) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (status) next.set("status", status);
    if (category) next.set("category", category);
    next.set("page", String(page));
    next.set("size", String(pageSize));
    next.set("sort", sort);
    next.set("direction", direction);
    redirect(`/admin/themes?${next.toString()}`);
  }

  const figure = (result: { count: number | null; error: unknown }) => (result.error || result.count === null ? "—" : result.count.toLocaleString("id-ID"));
  const inactiveCount = all.error || active.error || all.count === null || active.count === null ? null : all.count - active.count;

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader title="Kelola Tema" description="Kelola tema undangan yang tersedia untuk pengguna." actions={<Button asChild><Link href="/admin/themes/create">Buat Tema</Link></Button>} />
      <BackendStatGrid aria-label="Ringkasan tema">
        <BackendStatCard label="Total tema" value={figure(all)} icon={PaletteIcon} href="/admin/themes" />
        <BackendStatCard label="Aktif" value={figure(active)} description="Tampil di katalog" icon={CircleCheckIcon} href="/admin/themes?status=active" />
        <BackendStatCard label="Nonaktif" value={inactiveCount === null ? "—" : inactiveCount.toLocaleString("id-ID")} description="Disembunyikan dari katalog" icon={CircleSlashIcon} href="/admin/themes?status=inactive" />
        <BackendStatCard label="Premium" value={figure(premium)} icon={SparklesIcon} />
      </BackendStatGrid>
      {error ? (
        <AdminTableError title="Tema gagal dimuat" description="Periksa izin baca admin pada database." />
      ) : (
        <ThemesTable
          data={(data ?? []) as unknown as AdminThemeRow[]}
          page={page}
          pageSize={pageSize}
          rowCount={total}
          sort={sort}
          direction={direction}
          filters={[
            { key: "status", label: "Status", value: status, options: [{ label: "Aktif", value: "active" }, { label: "Nonaktif", value: "inactive" }] },
            { key: "category", label: "Kategori", value: category, options: THEME_CATEGORIES.map((item) => ({ label: item.label, value: item.value })) },
          ]}
        />
      )}
    </div>
  );
}
