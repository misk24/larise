import { CardSkeleton, FieldSkeleton, HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Breadcrumb-free header, a settings form card, then the section list card.
export default function Loading() {
  return (
    <LoadingPage label="Memuat tema">
      <HeaderSkeleton />
      <CardSkeleton>
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <FieldSkeleton key={index} />
          ))}
          <Skeleton className="h-24 w-full sm:col-span-2" />
        </div>
        <Skeleton className="mt-6 h-9 w-36" />
      </CardSkeleton>
      <CardSkeleton>
        <ul className="divide-y rounded-lg border">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="flex items-center gap-3 p-3">
              <Skeleton className="size-5" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="ml-auto h-6 w-16 rounded-full" />
            </li>
          ))}
        </ul>
      </CardSkeleton>
    </LoadingPage>
  );
}
