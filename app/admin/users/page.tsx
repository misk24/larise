import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ q?: string }>;

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 100) ?? "";
  const supabase = await createClient();
  let request = supabase.from("profiles").select("id,full_name,email,role,created_at,invitations(count)").order("created_at", { ascending: false }).limit(100);
  if (query) request = request.or(`full_name.ilike.%${query.replace(/[%_,().]/g, " ")}%,email.ilike.%${query.replace(/[%_,().]/g, " ")}%`);
  const { data: users, error } = await request;
  return <div className="space-y-6"><div><h1 className="text-2xl md:text-3xl font-medium">Kelola Pengguna</h1><p className="text-muted-foreground">Cari dan tinjau akun terdaftar. Maksimal 100 hasil terbaru.</p></div>
    <Card className="border-border bg-sidebar"><CardHeader><CardTitle>Daftar Pengguna</CardTitle><CardDescription>{users?.length ?? 0} hasil</CardDescription></CardHeader><CardContent className="space-y-4">
      <form action="/admin/users" className="flex gap-2"><Input name="q" defaultValue={query} placeholder="Cari nama atau email..." aria-label="Cari pengguna"/><button className="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" type="submit">Cari</button></form>
      {error ? <p role="alert" className="text-sm text-destructive">Data pengguna gagal dimuat. Periksa izin database.</p> : users?.length ? <div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Undangan</TableHead><TableHead>Tanggal daftar</TableHead></TableRow></TableHeader><TableBody>
        {users.map(user => <TableRow key={user.id}><TableCell className="font-medium">{user.full_name || "-"}</TableCell><TableCell>{user.email || "-"}</TableCell><TableCell><Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role === "admin" ? "Admin" : "User"}</Badge></TableCell><TableCell>{user.invitations?.[0]?.count || 0}</TableCell><TableCell>{new Date(user.created_at).toLocaleDateString("id-ID")}</TableCell></TableRow>)}
      </TableBody></Table></div> : <p className="py-10 text-center text-muted-foreground">Tidak ada pengguna yang cocok.</p>}
    </CardContent></Card></div>;
}
