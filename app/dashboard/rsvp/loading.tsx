import { BadgeSkeleton, CardSkeleton, HeaderSkeleton, LoadingPage, StatGridSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Four figures, then "Respons terbaru": guest and invitation on the left, status chip and date on the right.
export default function Loading() {
  return (
    <LoadingPage label="Memuat ringkasan RSVP">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <CardSkeleton>
        <ul className="divide-y">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="flex items-center justify-between gap-4 py-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-52 max-w-full" />
              </div>
              <div className="flex items-center gap-3">
                <BadgeSkeleton />
                <Skeleton className="hidden h-3 w-20 sm:block" />
              </div>
            </li>
          ))}
        </ul>
      </CardSkeleton>
    </LoadingPage>
  );
}
