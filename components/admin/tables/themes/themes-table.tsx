"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/data-table";
import { ThemeActions } from "@/components/admin/theme-actions";

export type AdminThemeRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  is_active: boolean;
  created_at: string;
};

type Props = {
  data: AdminThemeRow[];
  page: number;
  pageSize: number;
  rowCount: number;
  sort: string;
  direction: "asc" | "desc";
};

export function ThemesTable(props: Props) {
  const columns = useMemo<ColumnDef<AdminThemeRow, unknown>[]>(() => [
    {
      accessorKey: "name",
      header: "Nama tema",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="min-w-36">
          <Link href={`/admin/themes/${row.original.id}`} className="font-medium hover:text-primary hover:underline">
            {row.original.name}
          </Link>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      enableSorting: true,
      cell: ({ row }) => <span className="capitalize">{row.original.category || "—"}</span>,
    },
    {
      accessorKey: "price",
      header: "Harga",
      enableSorting: true,
      cell: ({ row }) => row.original.price ? `Rp ${row.original.price.toLocaleString("id-ID")}` : "Gratis",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "secondary"}>
          {row.original.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Dibuat",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("id-ID"),
    },
    {
      id: "actions",
      header: "Aksi",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex min-w-max flex-row items-center gap-2 whitespace-nowrap">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/themes/${row.original.id}`}>Edit</Link>
          </Button>
          <ThemeActions id={row.original.id} active={row.original.is_active} name={row.original.name} />
        </div>
      ),
    },
  ], []);

  return (
    <AdminDataTable
      {...props}
      columns={columns}
      emptyMessage="Belum ada tema yang cocok dengan pencarian."
      searchPlaceholder="Cari nama atau slug tema..."
    />
  );
}
