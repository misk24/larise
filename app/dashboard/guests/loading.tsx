import { HeaderSkeleton, LoadingPage, PickerSkeleton, TableSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Header, invitation picker, the manager's add button and search/status toolbar, then Nama, Kontak, Status RSVP, Jumlah hadir, Aksi.
export default function Loading() {
  return (
    <LoadingPage label="Memuat daftar tamu">
      <HeaderSkeleton />
      <PickerSkeleton />
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-36" />
        </div>
        <TableSkeleton columns={["w-32", "w-36", "w-24", "w-16", "w-16"]} filters={1} pageSizeSelect={false} footer={false} />
      </div>
    </LoadingPage>
  );
}
