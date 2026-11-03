"use client";

import { LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminTableError({
  title = "Data gagal dimuat",
  description = "Terjadi kendala saat mengambil data. Silakan coba lagi.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div role="alert" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <TriangleAlert className="size-6 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => router.refresh()}>
        <RefreshCw className="mr-2 size-4" /> Coba lagi
      </Button>
    </div>
  );
}

export function AdminTableLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Memuat tabel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="flex h-11 items-center gap-4 border-b bg-muted/60 px-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex h-14 items-center gap-4 border-b px-4 last:border-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      <span className="sr-only"><LoaderCircle className="inline size-4 animate-spin" /> Memuat data tabel...</span>
    </div>
  );
}
