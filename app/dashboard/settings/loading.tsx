import { HeaderSkeleton, LoadingPage, RowListSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Narrow column, three settings rows: icon, title and description, trailing badge or button.
export default function Loading() {
  return (
    <LoadingPage label="Memuat pengaturan" className="mx-auto w-full max-w-4xl">
      <HeaderSkeleton />
      <RowListSkeleton
        rows={3}
        row={
          <div className="flex items-center gap-4">
            <Skeleton className="hidden size-5 sm:block" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        }
      />
    </LoadingPage>
  );
}
