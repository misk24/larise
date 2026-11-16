import { HeaderSkeleton, LoadingPage, PickerSkeleton } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Header, picker, then the moderation grid: message cards with a hide button and a delete icon.
export default function Loading() {
  return (
    <LoadingPage label="Memuat ucapan">
      <HeaderSkeleton />
      <PickerSkeleton />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="shadow-none">
            <CardContent className="flex h-full flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="size-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </LoadingPage>
  );
}
