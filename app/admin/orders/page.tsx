import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrdersTable, type AdminOrderRow } from "@/components/admin/tables/orders/orders-table";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/actions/auth";
import { sanitizeAdminSearch } from "@/lib/utils/admin-search";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  page?: string;
  size?: string;
  sort?: string;
  direction?: string;
}>;

const statuses = ["pending", "paid", "expired", "refunded"] as const;

function positiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const query = sanitizeAdminSearch(params.q);
  const status = statuses.find((value) => value === params.status) ?? "";
  const pageSize = [10, 20, 50].includes(Number(params.size)) ? Number(params.size) : 20;
  const sortFields = ["created_at", "order_number", "amount", "payment_status"] as const;
  const sort = sortFields.find((field) => field === params.sort) ?? "created_at";
  const direction = params.direction === "asc" ? "asc" : "desc";
  const requestedPage = positiveInteger(params.page, 1, 1_000_000);
  const supabase = createAdminClient();

  let request = supabase
    .from("orders")
    .select("id,order_number,user_id,amount,payment_status,created_at,profiles(full_name,email)", { count: "exact" })
    .order(sort, { ascending: direction === "asc" })
    .range((requestedPage - 1) * pageSize, requestedPage * pageSize - 1);

  if (status) request = request.eq("payment_status", status);
  if (query) {
    request = request.or(
      `order_number.ilike.%${query}%,payment_status.ilike.%${query}%`,
    );
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
    redirect(`/admin/orders?${next.toString()}`);
  }

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Pesanan</h1>
        <p className="text-muted-foreground">Pantau pesanan dan status pembayaran pengguna.</p>
      </header>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            {error ? "Jumlah pesanan tidak dapat dimuat." : `${total.toLocaleString("id-ID")} pesanan`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/orders" className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input type="hidden" name="q" value={query} />
            <label htmlFor="order-status" className="text-sm text-muted-foreground">Status pembayaran</label>
            <Select name="status" defaultValue={status || "all"}>
              <SelectTrigger id="order-status" className="w-full sm:w-52">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="pending">Menunggu pembayaran</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="expired">Kedaluwarsa</SelectItem>
                <SelectItem value="refunded">Dikembalikan</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="submit"
              className="h-9 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground"
              formAction="/admin/orders"
            >
              Terapkan
            </button>
          </form>

          {error ? (
            <p role="alert" className="py-8 text-center text-sm text-destructive">
              Data pesanan gagal dimuat. Periksa izin baca admin dan relasi pengguna pada database.
            </p>
          ) : (
            <OrdersTable
              data={(data ?? []) as AdminOrderRow[]}
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
