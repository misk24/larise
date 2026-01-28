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
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .select("*, invitations(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-2xl md:text-3xl font-medium">
          Kelola Pengguna
        </span>
        <p className="text-muted-foreground">
          Lihat dan kelola semua pengguna terdaftar
        </p>
      </div>
      <Card className="border-border bg-sidebar">
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
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead className="text-primary font-semibold">
                      Nama
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Role
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
                      Undangan
                    </TableHead>
                    <TableHead className="text-primary font-semibold">
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
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
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
