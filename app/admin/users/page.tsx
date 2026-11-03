import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { UsersIcon } from "lucide-react";

type SearchParams = Promise<{ q?: string }>;

function sanitizeSearch(value: string | undefined) {
  return value?.trim().slice(0, 80).replace(/[,%_().\\]/g, " ").replace(/\s+/g, " ") ?? "";
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = sanitizeSearch(params.q);
  const supabase = await createClient();

  let request = supabase
    .from("profiles")
    .select("id,full_name,email,role,created_at,invitations(count)", { count: "exact" })
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(100);

  if (query) request = request.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);

  const { data: users, count, error } = await request;

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Pengguna</h1>
        <p className="text-muted-foreground">Cari dan tinjau akun pengguna yang terdaftar di LARISÉ.</p>
      </header>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            {error ? "Jumlah pengguna tidak dapat dimuat." : `${(count ?? 0).toLocaleString("id-ID")} pengguna`}
            {count !== null && count > 100 ? " · Menampilkan 100 hasil terbaru" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/users" className="flex flex-col gap-2 sm:flex-row">
            <Input name="q" defaultValue={query} placeholder="Cari nama atau email..." aria-label="Cari pengguna" />
            <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              Cari
            </button>
          </form>

          {error ? (
            <p role="alert" className="py-8 text-center text-sm text-destructive">
              Data pengguna gagal dimuat. Periksa izin baca admin pada database.
            </p>
          ) : users?.length ? (
            <div className="backend-table-container">
              <Table>
                <TableHeader className="bg-muted/70">
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Undangan</TableHead>
                    <TableHead>Tanggal daftar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || "Tanpa nama"}</TableCell>
                      <TableCell>{user.email || "—"}</TableCell>
                      <TableCell>{user.invitations?.[0]?.count ?? 0}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString("id-ID")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <UsersIcon aria-hidden="true" className="mx-auto mb-4 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {query ? "Tidak ada pengguna yang cocok dengan pencarian." : "Belum ada pengguna terdaftar."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
