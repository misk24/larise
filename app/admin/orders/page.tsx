import { BackendEmptyState, BackendPageHeader } from "@/components/backend/backend-ui";
import { ShoppingCartIcon } from "lucide-react";
import { requireAdmin } from "@/lib/actions/auth";

export default async function AdminOrdersPage() {
  await requireAdmin();

  return (
    <div className="backend-content space-y-6">
      <BackendPageHeader title="Kelola Pesanan" description="Pantau pesanan dan status pembayaran pengguna." />
      <BackendEmptyState
        icon={ShoppingCartIcon}
        title="Data pesanan belum tersedia"
        description="Database LARISÉ belum memiliki tabel pesanan, jadi daftar pesanan belum bisa ditampilkan. Halaman ini aktif setelah skema pesanan, alur pembayaran, dan status transaksi ditetapkan."
      />
    </div>
  );
}
