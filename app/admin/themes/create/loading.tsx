import { CardSkeleton, FieldSkeleton, HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// One field and a submit button inside a narrow card.
export default function Loading() {
  return (
    <LoadingPage label="Memuat formulir tema">
      <HeaderSkeleton />
      <CardSkeleton headerless className="w-full max-w-2xl">
        <div className="space-y-5">
          <FieldSkeleton />
          <Skeleton className="h-9 w-full sm:w-44" />
        </div>
      </CardSkeleton>
    </LoadingPage>
  );
}
