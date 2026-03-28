"use client";

import { DataTable } from "@/components/shared/datatable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface Props {
  data: User[];
}

const columnHelper = createColumnHelper<User>();

export default function RecentUsersTable({ data }: Props) {
  const columns = [
    columnHelper.accessor("full_name", {
      header: "User",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={user.avatar_url ?? ""} alt="" />
              <AvatarFallback className="text-xs">
                {getAvatarCallback(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="text-card-foreground font-medium">
                {user.full_name}
              </span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Tanggal Daftar",
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("created_at")).toLocaleDateString("id-ID")}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

function getAvatarCallback(name?: string) {
  if (!name) return "?";

  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
