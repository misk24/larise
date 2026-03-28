"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  table: Table<any>;
}

export function DataTablePagination({ table }: Props) {
  if (!table.getPageCount) return null;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2,
  });

  return (
    <>
      <p
        className=" text-muted-foreground whitespace-nowrap"
        aria-live="polite"
      >
        Showing{" "}
        <span>
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            Math.max(
              table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                table.getState().pagination.pageSize,
              0,
            ),
            table.getRowCount(),
          )}
        </span>{" "}
        of <span>{table.getRowCount().toString()} entries</span>
      </p>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant={"ghost"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon aria-hidden="true" />
                Previous
              </Button>
            </PaginationItem>

            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((page) => {
              const isActive =
                page === table.getState().pagination.pageIndex + 1;

              return (
                <PaginationItem key={page}>
                  <Button
                    size="icon"
                    onClick={() => table.setPageIndex(page - 1)}
                    className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              );
            })}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Go to next page"
              >
                Next
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
