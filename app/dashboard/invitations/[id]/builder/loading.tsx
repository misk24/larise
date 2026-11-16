import { HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// The builder is denser (space-y-6, wide): header, a status bar with the publish button,
// the Sections/Preview switch, then the section list.
export default function Loading() {
  return (
    <LoadingPage label="Memuat builder" className="mx-auto max-w-[1800px] space-y-6">
      <HeaderSkeleton action="w-40" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-lg border bg-muted p-1">
          <Skeleton className="h-10" />
          <Skeleton className="h-10 bg-transparent" />
        </div>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                <Skeleton className="size-5" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="ml-auto h-6 w-10 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </LoadingPage>
  );
}
