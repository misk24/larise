"use client";

import type { ReactNode } from "react";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { PaletteIcon } from "lucide-react";
import { BackendStatusBadge } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminTableFilter } from "@/components/admin/data-table";
import { ThemeActions } from "@/components/admin/theme-actions";
import { themeCategoryLabel } from "@/lib/theme-categories";

export type AdminThemeRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  is_active: boolean;
  is_premium: boolean;
  thumbnail_url: string | null;
  created_at: string;
  theme_sections: { count: number }[] | null;
};

type Props = {
  filters?: AdminTableFilter[];
  toolbarContent?: ReactNode;
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
      header: "Tema",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-3">
          <div className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
            {row.original.thumbnail_url ? (
              // Admin-supplied URLs can point to any host, so next/image's allow-list does not apply here.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.original.thumbnail_url} alt="" loading="lazy" className="size-full object-cover" />
            ) : (
              <PaletteIcon aria-hidden="true" className="size-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link href={`/admin/themes/${row.original.id}`} className="font-medium hover:text-primary hover:underline">
                {row.original.name}
              </Link>
              {row.original.is_premium ? <BackendStatusBadge tone="info" className="px-2 py-0 text-xs">Premium</BackendStatusBadge> : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      enableSorting: true,
      cell: ({ row }) => themeCategoryLabel(row.original.category),
    },
    {
      accessorKey: "price",
      header: "Harga",
      enableSorting: true,
      cell: ({ row }) => <span className="tabular-nums">{row.original.price ? `Rp ${row.original.price.toLocaleString("id-ID")}` : "Gratis"}</span>,
    },
    {
      id: "sections",
      header: "Section",
      enableSorting: false,
      cell: ({ row }) => {
        const count = row.original.theme_sections?.[0]?.count ?? 0;
        return count ? <span className="tabular-nums">{count}</span> : <span className="text-muted-foreground">Belum ada</span>;
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <BackendStatusBadge tone={row.original.is_active ? "success" : "neutral"}>
          {row.original.is_active ? "Aktif" : "Nonaktif"}
        </BackendStatusBadge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Dibuat",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" }),
    },
    {
      id: "actions",
      header: "Aksi",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex min-w-max flex-row items-center gap-2 whitespace-nowrap">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/themes/${row.original.id}`}>Atur tema<span className="sr-only">: {row.original.name}</span></Link>
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
