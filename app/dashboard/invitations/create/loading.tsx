import { CardSkeleton, FieldSkeleton, HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// Two cards, as in the form: couple details (bride and groom side by side, slug), then the theme picker.
export default function Loading() {
  return (
    <LoadingPage label="Memuat formulir undangan">
      <HeaderSkeleton />
      <CardSkeleton>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1].map((side) => (
              <div key={side} className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
            ))}
          </div>
          <FieldSkeleton />
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
