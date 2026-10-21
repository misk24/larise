import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { UsersIcon } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*, invitations(count)")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  return (
    <div className="backend-content space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Kelola Pengguna
        </h1>
        <p className="text-muted-foreground">
          Lihat dan kelola semua pengguna terdaftar
        </p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Total {users?.length || 0} pengguna terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="text-foreground">
                      Nama
                    </TableHead>
                    <TableHead className="text-foreground">
                      Email
                    </TableHead>
                    <TableHead className="text-foreground">
                      Role
                    </TableHead>
                    <TableHead className="text-foreground">
                      Undangan
                    </TableHead>
                    <TableHead className="text-foreground">
                      Tanggal Daftar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.invitations?.[0]?.count || 0}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Belum ada pengguna terdaftar
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
