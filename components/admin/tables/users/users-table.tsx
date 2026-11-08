"use client";

import type { ReactNode } from "react";

import {
  AdminDataTable,
  type AdminTableFilter,
} from "@/components/admin/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export type AdminUserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  invitations: { count: number }[];
};

type Props = {
  filters?: AdminTableFilter[];
  toolbarContent?: ReactNode;
  data: AdminUserRow[];
  page: number;
  pageSize: number;
  rowCount: number;
  sort: string;
  direction: "asc" | "desc";
};

export function UsersTable(props: Props) {
  const columns = useMemo<ColumnDef<AdminUserRow, unknown>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: "Nama",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.full_name || "Tanpa nama"}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email || "—",
        enableSorting: true,
      },
      {
        id: "invitations",
        header: "Undangan",
        cell: ({ row }) => row.original.invitations?.[0]?.count ?? 0,
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: "Tanggal daftar",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString("id-ID"),
        enableSorting: true,
      },
    ],
    [],
  );
  return (
    <AdminDataTable
      {...props}
      columns={columns}
      emptyMessage="Tidak ada pengguna yang cocok dengan pencarian."
      searchPlaceholder="Cari nama atau email..."
    />
  );
}
