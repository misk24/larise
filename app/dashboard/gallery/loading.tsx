import { CardSkeleton, HeaderSkeleton, LoadingPage, PickerSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Header, picker, then one card: upload area and a grid of square photos, as in the uploader.
export default function Loading() {
  return (
    <LoadingPage label="Memuat galeri">
      <HeaderSkeleton />
      <PickerSkeleton />
      <CardSkeleton>
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-lg border border-dashed bg-transparent" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardSkeleton>
    </LoadingPage>
  );
}
