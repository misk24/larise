import { CardSkeleton, FieldSkeleton, HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Narrow column, three cards: profile (avatar, name and phone, email), login security, danger zone.
export default function Loading() {
  return (
    <LoadingPage label="Memuat akun" className="mx-auto w-full max-w-4xl">
      <HeaderSkeleton />
      <CardSkeleton>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <FieldSkeleton />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardSkeleton>
      <CardSkeleton>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardSkeleton>
      <CardSkeleton>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-72 max-w-full" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardSkeleton>
    </LoadingPage>
  );
}
