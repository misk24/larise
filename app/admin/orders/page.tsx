import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { requireAdmin } from "@/lib/actions/auth";

export default async function AdminOrdersPage() {
  await requireAdmin();

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Pesanan</h1>
        <p className="text-muted-foreground">Pantau pesanan dan status pembayaran pengguna.</p>
      </header>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Data pesanan belum tersedia</CardTitle>
          <CardDescription>Halaman ini menunggu model data pesanan resmi.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>
              Database LARISÉ saat ini belum memiliki tabel pesanan. Daftar pesanan tidak dapat
              ditampilkan sampai skema order, alur pembayaran, dan status transaksi ditetapkan.
              Tidak ada data pesanan yang dibuat atau diasumsikan oleh halaman ini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
