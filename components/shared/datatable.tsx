import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { flexRender, Table as ReactTableType } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  ExternalLinkIcon,
  UsersIcon,
} from "lucide-react";

interface Props {
  table: ReactTableType<any>;
  enableFiltering?: boolean;
  enableSorting?: boolean;
}

export function DataTable({
  table,
  enableFiltering = false,
  enableSorting = false,
}: Props) {
  const isMobile = useIsMobile();
  const getSortIcon = (column: any) => {
    if (!enableSorting) return null;

    const sorted = column.getIsSorted();

    if (!sorted) return <ChevronsUpDownIcon className="size-3" />;
    if (sorted === "asc") return <ChevronUpIcon className="size-3" />;
    return <ChevronDownIcon className="size-3" />;
  };

  return (
    <div className="space-y-4">
      {enableFiltering && (
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search..."
            value={(table.getState() as any).globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="w-56"
          />
          <div className="flex gap-4">
            <Button variant="outline" size={isMobile ? "icon" : "default"}>
              <ExternalLinkIcon />
              {isMobile ? "" : "Export"}
            </Button>
            <Button size={isMobile ? "icon" : "default"}>
              <DownloadIcon />
              {isMobile ? "" : "Download"}
            </Button>
          </div>
        </div>
      )}

      <div className="w-full border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary hover:bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={
                      enableSorting
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={cn(
                      "text-primary-foreground first:pl-4",
                      enableSorting ? " cursor-pointer select-none" : "",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {getSortIcon(header.column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-48 text-center"
                >
                  <UsersIcon className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {/* Belum ada pengguna terdaftar */}
                    Data tidak tersedia
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
