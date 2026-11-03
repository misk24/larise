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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
};

export function AdminDataTable<TData>({
  columns, data, page, pageSize, rowCount, sort, direction, emptyMessage, searchPlaceholder,
}: AdminDataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 350);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (debouncedSearchTerm === currentQuery.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    else params.delete("q");
    params.set("page", "1");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
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
      updateParams({ sort: first?.id ?? null, direction: first ? (first.desc ? "desc" : "asc") : null, page: "1" });
    },
    enableMultiSort: false,
  });

  const start = rowCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, rowCount);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="admin-table-page-size" className="text-sm text-muted-foreground whitespace-nowrap">Baris per halaman</label>
          <Select value={String(pageSize)} onValueChange={(value) => updateParams({ size: value, page: "1" })}>
            <SelectTrigger id="admin-table-page-size" className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
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
                        <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-2 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
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
              <TableRow><TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Menampilkan <span className="font-medium text-foreground">{start.toLocaleString("id-ID")}-{end.toLocaleString("id-ID")}</span> dari <span className="font-medium text-foreground">{rowCount.toLocaleString("id-ID")}</span> data
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="mr-1 size-4" />Sebelumnya</Button>
          <span className="min-w-20 text-center text-sm tabular-nums">Halaman {page} / {Math.max(1, table.getPageCount())}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Berikutnya<ChevronRight className="ml-1 size-4" /></Button>
        </div>
      </div>
    </section>
  );
}
