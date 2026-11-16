import { CardSkeleton, HeaderSkeleton, LoadingPage, StatGridSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the admin overview: header, four platform figures, then two "latest five" lists.
export default function Loading() {
  return (
    <LoadingPage label="Memuat ringkasan admin">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <div className="grid gap-6 xl:grid-cols-2">
        {[0, 1].map((card) => (
          <CardSkeleton key={card}>
            <ul className="divide-y">
              {Array.from({ length: 5 }).map((_, row) => (
                <li key={row} className="flex items-center justify-between gap-4 py-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-48 max-w-full" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </li>
              ))}
            </ul>
          </CardSkeleton>
        ))}
      </div>
    </LoadingPage>
  );
}
