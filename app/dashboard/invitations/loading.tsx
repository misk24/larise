import { BadgeSkeleton, HeaderSkeleton, LoadingPage, RowListSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Header with "Buat undangan", then one row per invitation: names, theme and slug, status, five actions.
export default function Loading() {
  return (
    <LoadingPage label="Memuat undangan">
      <HeaderSkeleton action="w-36" />
      <RowListSkeleton
        rows={4}
        row={
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-60 max-w-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <BadgeSkeleton />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        }
      />
    </LoadingPage>
  );
}
