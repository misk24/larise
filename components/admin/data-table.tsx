"use client";

import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  LoaderCircle,
  Search,
  SearchX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AdminDataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  page: number;
  pageSize: number;
  rowCount: number;
  sort: string;
  direction: "asc" | "desc";
  emptyMessage: string;
  searchPlaceholder: string;
  toolbarContent?: ReactNode;
};

export function AdminDataTable<TData>({
  columns,
  data,
  page,
  pageSize,
  rowCount,
  sort,
  direction,
  emptyMessage,
  searchPlaceholder,
  toolbarContent,
}: AdminDataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 350);
  const [isPending, startTransition] = useTransition();
  const hasLocalEdits = useRef(false);
  const lastSyncedQuery = useRef(currentQuery);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (hasLocalEdits.current) {
      if (currentQuery === searchTerm.trim()) {
        hasLocalEdits.current = false;
        lastSyncedQuery.current = currentQuery;
      }
      return;
    }

    if (lastSyncedQuery.current !== currentQuery) {
      lastSyncedQuery.current = currentQuery;
      setSearchTerm(currentQuery);
    }
  }, [currentQuery, searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm === currentQuery.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    else params.delete("q");
    params.set("page", "1");

    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }, [currentQuery, debouncedSearchTerm, pathname, router, searchParams]);

  const sorting = useMemo<SortingState>(() => [{ id: sort, desc: direction === "desc" }], [sort, direction]);
  const pagination = useMemo<PaginationState>(() => ({ pageIndex: page - 1, pageSize }), [page, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(rowCount / pageSize),
    rowCount,
    state: { pagination, sorting },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      updateParams({ page: String(next.pageIndex + 1), size: String(next.pageSize) });
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      updateParams({
        sort: first?.id ?? null,
        direction: first ? (first.desc ? "desc" : "asc") : null,
        page: "1",
      });
    },
    enableMultiSort: false,
  });

  const start = rowCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, rowCount);
  const hasActiveFilters = Boolean(searchTerm.trim() || searchParams.get("status"));

  function clearFilters() {
    hasLocalEdits.current = false;
    setSearchTerm("");
    lastSyncedQuery.current = "";
    updateParams({ q: null, status: null, page: "1" });
  }

  return (
    <section className="space-y-4" aria-busy={isPending}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                hasLocalEdits.current = true;
                setSearchTerm(event.target.value);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full pl-9"
            />
          </div>
          {toolbarContent ? <div className="flex flex-wrap items-center gap-2">{toolbarContent}</div> : null}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="admin-table-page-size" className="whitespace-nowrap text-sm text-muted-foreground">Baris per halaman</label>
          <Select value={String(pageSize)} onValueChange={(value) => updateParams({ size: value, page: "1" })}>
            <SelectTrigger id="admin-table-page-size" className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border" aria-live="polite">
        <div className={isPending ? "opacity-50 transition-opacity" : "transition-opacity"}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/60">
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <TableHead key={header.id} aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}>
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-2 rounded-sm font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {sorted === "asc" ? <ChevronUp className="size-3.5" /> : sorted === "desc" ? <ChevronDown className="size-3.5" /> : <ChevronsUpDown className="size-3.5 opacity-50" />}
                            </button>
                          ) : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={Math.max(columns.length, 1)} className="h-36">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <SearchX className="size-5 text-muted-foreground" aria-hidden="true" />
                        <p className="text-sm font-medium">{emptyMessage}</p>
                        {hasActiveFilters ? (
                          <Button type="button" variant="link" size="sm" onClick={clearFilters}>Hapus pencarian dan filter</Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[1px]" role="status">
            <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm">
              <LoaderCircle className="size-4 animate-spin" /> Memuat data...
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Menampilkan <span className="font-medium text-foreground">{start.toLocaleString("id-ID")}-{end.toLocaleString("id-ID")}</span> dari <span className="font-medium text-foreground">{rowCount.toLocaleString("id-ID")}</span> data
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isPending}>
            <ChevronLeft className="mr-1 size-4" />Sebelumnya
          </Button>
          <span className="min-w-20 text-center text-sm tabular-nums">Halaman {page} / {Math.max(1, table.getPageCount())}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isPending}>
            Berikutnya<ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
