"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/data-table";

type OrderOwner = { full_name: string | null; email: string | null };

export type AdminOrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  amount: number;
  payment_status: "pending" | "paid" | "expired" | "refunded" | string;
  created_at: string;
  profiles: OrderOwner | OrderOwner[] | null;
};

type Props = {
  data: AdminOrderRow[];
  page: number;
  pageSize: number;
  rowCount: number;
  sort: string;
  direction: "asc" | "desc";
};

function relation(value: OrderOwner | OrderOwner[] | null): OrderOwner | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Menunggu pembayaran";
    case "paid":
      return "Lunas";
    case "expired":
      return "Kedaluwarsa";
    case "refunded":
      return "Dikembalikan";
    default:
      return status;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "paid":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "expired":
    case "refunded":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

export function OrdersTable(props: Props) {
  const columns = useMemo<ColumnDef<AdminOrderRow, unknown>[]>(() => [
    {
      accessorKey: "order_number",
      header: "ID Pesanan",
      enableSorting: true,
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.order_number}</span>,
    },
    {
      id: "customer",
      header: "Pelanggan",
      enableSorting: false,
      cell: ({ row }) => {
        const owner = relation(row.original.profiles);
        return (
          <div className="min-w-40">
            <p className="font-medium">{owner?.full_name || "Tanpa nama"}</p>
            <p className="text-xs text-muted-foreground">{owner?.email || "Email tidak tersedia"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Jumlah",
      enableSorting: true,
      cell: ({ row }) => `Rp ${Number(row.original.amount).toLocaleString("id-ID")}`,
    },
    {
      accessorKey: "payment_status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.payment_status)}>
          {statusLabel(row.original.payment_status)}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ], []);

  return (
    <AdminDataTable
      {...props}
      columns={columns}
      emptyMessage="Tidak ada pesanan yang cocok dengan pencarian atau filter."
      searchPlaceholder="Cari nomor pesanan atau status..."
    />
  );
}
