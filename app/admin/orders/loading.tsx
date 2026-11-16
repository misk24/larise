import { HeaderSkeleton, LoadingPage } from "@/components/backend/backend-loading";
import { Skeleton } from "@/components/ui/skeleton";

// The orders page is a placeholder block under its header, so the skeleton is one empty-state sized block.
export default function Loading() {
  return (
    <LoadingPage label="Memuat pesanan">
      <HeaderSkeleton />
      <Skeleton className="h-56 rounded-xl" />
    </LoadingPage>
  );
}
