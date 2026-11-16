import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Building blocks for route-level `loading.tsx` files.
 * Each route composes these in the same order and proportions as its real page,
 * so the skeleton shows the shape of what is about to appear, not a generic placeholder.
 */

export function LoadingPage({
  label = "Memuat halaman",
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("backend-content space-y-8", className)} role="status" aria-busy="true" aria-label={label}>
      {children}
      <span className="sr-only">{label}...</span>
    </div>
  );
}

/** Mirrors `BackendPageHeader`: title, one-line description, optional action button. */
export function HeaderSkeleton({ action }: { action?: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 md:h-9" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {action ? <Skeleton className={cn("h-9", action)} /> : null}
    </div>
  );
}

/** Mirrors `BackendSectionHeader`. */
export function SectionHeaderSkeleton({ action }: { action?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
      {action ? <Skeleton className={cn("h-8", action)} /> : null}
    </div>
  );
}

/** Mirrors `BackendStatGrid`: one connected strip, dividers drawn by the 1px gap. */
export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 bg-card p-4 sm:p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Mirrors `BackendInvitationPicker`. */
export function PickerSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-full sm:w-72" />
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

/** A Card with its own title and description, as used for sections with a purpose. */
export function CardSkeleton({
  children,
  className,
  headerless,
}: {
  children: ReactNode;
  className?: string;
  headerless?: boolean;
}) {
  return (
    <Card className={className}>
      {headerless ? null : (
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Rows inside a bordered, divided list, e.g. invitations or settings. */
export function RowListSkeleton({
  rows = 3,
  row,
  className,
}: {
  rows?: number;
  row: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <ul className="divide-y">
        {Array.from({ length: rows }).map((_, index) => (
          <li key={index} className="p-4 sm:p-5">
            {row}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Status chip placeholder. */
export function BadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />;
}

/**
 * Mirrors `AdminDataTable` and the guest table: toolbar (search, optional filters),
 * header row, body rows, then the footer with range text and pager.
 * `columns` are width classes, one per real column, so the table has the same column count.
 */
export function TableSkeleton({
  columns,
  rows = 8,
  filters = 0,
  pageSizeSelect = true,
  footer = true,
}: {
  columns: string[];
  rows?: number;
  filters?: number;
  pageSizeSelect?: boolean;
  footer?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-9 w-full sm:max-w-sm" />
        {Array.from({ length: filters }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full sm:w-52" />
        ))}
        {pageSizeSelect ? <Skeleton className="h-9 w-40 sm:ml-auto" /> : null}
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex h-11 items-center gap-6 border-b bg-muted/40 px-4">
          {columns.map((width, index) => (
            <Skeleton key={index} className={cn("h-4 max-w-full", width)} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex h-14 items-center gap-6 border-b px-4 last:border-0">
            {columns.map((width, index) => (
              <Skeleton key={index} className={cn("h-4 max-w-full", width)} />
            ))}
          </div>
        ))}
      </div>
      {footer ? (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-40" />
        </div>
      ) : null}
    </div>
  );
}

/** A label above a full-width input, as in the forms. */
export function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
