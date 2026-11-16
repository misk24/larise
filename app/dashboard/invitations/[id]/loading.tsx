import { CardSkeleton, FieldSkeleton, HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Same two cards as the create form, in the narrower edit layout.
export default function Loading() {
  return (
    <LoadingPage label="Memuat info undangan" className="mx-auto w-full max-w-4xl">
      <HeaderSkeleton />
      <CardSkeleton>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <FieldSkeleton key={index} />
            ))}
          </div>
          <Skeleton className="h-9 w-40" />
        </div>
      </CardSkeleton>
      <CardSkeleton>
        <div className="space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <ul className="divide-y overflow-hidden rounded-xl border">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex items-center gap-4 p-4">
              <Skeleton className="size-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
              <Skeleton className="size-5 rounded-full" />
            </li>
          ))}
        </ul>
        </div>
      </CardSkeleton>
    </LoadingPage>
  );
}
