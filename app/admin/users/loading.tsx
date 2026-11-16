import { HeaderSkeleton, LoadingPage, TableSkeleton } from "@/components/backend/backend-loading";

// Nama, Email, Undangan, Tanggal daftar. Search only, no filters.
export default function Loading() {
  return (
    <LoadingPage label="Memuat daftar pengguna">
      <HeaderSkeleton />
      <TableSkeleton columns={["w-32", "w-48", "w-16", "w-28"]} />
    </LoadingPage>
  );
}
