import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="backend-content space-y-6" role="status" aria-label="Memuat halaman">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <span className="sr-only">Memuat halaman...</span>
    </div>
  );
}
