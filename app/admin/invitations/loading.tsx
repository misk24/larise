import { HeaderSkeleton, LoadingPage, TableSkeleton } from "@/components/backend/backend-loading";

// Undangan, Pemilik, Tema, Status, Dibuat. Search plus the status filter.
export default function Loading() {
  return (
    <LoadingPage label="Memuat daftar undangan">
      <HeaderSkeleton />
      <TableSkeleton columns={["w-40", "w-32", "w-28", "w-20", "w-24"]} filters={1} />
    </LoadingPage>
  );
}
