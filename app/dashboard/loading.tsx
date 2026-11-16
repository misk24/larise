import { BadgeSkeleton, CardSkeleton, HeaderSkeleton, LoadingPage, RowListSkeleton, SectionHeaderSkeleton, StatGridSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the dashboard home: header with "Buat undangan", four figures, an invitation list beside an RSVP summary.
export default function Loading() {
  return (
    <LoadingPage label="Memuat dashboard">
      <HeaderSkeleton action="w-36" />
      <StatGridSkeleton />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <section className="min-w-0 space-y-4">
          <SectionHeaderSkeleton action="w-32" />
          <RowListSkeleton
            rows={3}
            row={
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-4 w-56 max-w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <BadgeSkeleton />
                </div>
                <Skeleton className="h-4 w-60 max-w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            }
          />
        </section>
        <aside className="min-w-0">
          <CardSkeleton>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
              <Skeleton className="h-8 w-full" />
            </div>
          </CardSkeleton>
        </aside>
      </div>
    </LoadingPage>
  );
}
