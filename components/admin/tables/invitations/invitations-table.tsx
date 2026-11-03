"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/data-table";

export type AdminInvitationRow = {
  id: string;
  groom_name: string;
  bride_name: string;
  slug: string;
  status: string;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  theme_name: string | null;
};

type Props = {
  data: AdminInvitationRow[];
  page: number;
  pageSize: number;
  rowCount: number;
  sort: string;
  direction: "asc" | "desc";
};

function statusVariant(status: string) {
  if (status === "published") return "default" as const;
  if (status === "unpublished") return "secondary" as const;
  return "outline" as const;
}

export function InvitationsTable(props: Props) {
  const columns = useMemo<ColumnDef<AdminInvitationRow, unknown>[]>(() => [
    {
      id: "slug",
      accessorKey: "slug",
      header: "Undangan",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="min-w-44">
          <p className="font-medium">{row.original.groom_name} &amp; {row.original.bride_name}</p>
          <Link href={`/${row.original.slug}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary hover:underline">
            {row.original.slug}
          </Link>
        </div>
      ),
    },
    {
      id: "owner",
      header: "Pemilik",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="min-w-40">
          <p className="font-medium">{row.original.owner_name || "Tanpa nama"}</p>
          <p className="text-xs text-muted-foreground">{row.original.owner_email || "Email tidak tersedia"}</p>
        </div>
      ),
    },
    {
      id: "theme",
      header: "Tema",
      enableSorting: false,
      cell: ({ row }) => row.original.theme_name || "Tema tidak diketahui",
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "created_at",
      header: "Dibuat",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("id-ID"),
    },
  ], []);

  return (
    <AdminDataTable
      {...props}
      columns={columns}
      emptyMessage="Tidak ada undangan yang cocok dengan pencarian atau filter."
      searchPlaceholder="Cari pasangan, slug, pemilik, email, atau tema..."
    />
  );
}
