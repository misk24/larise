import { HeaderSkeleton, LoadingPage, TableSkeleton } from "@/components/backend/backend-loading";

// Nama tema, Kategori, Harga, Status, Dibuat, Aksi. The page header carries the "Buat tema" action.
export default function Loading() {
  return (
    <LoadingPage label="Memuat daftar tema">
      <HeaderSkeleton action="w-28" />
      <TableSkeleton columns={["w-36", "w-24", "w-24", "w-20", "w-24", "w-40"]} />
    </LoadingPage>
  );
}
