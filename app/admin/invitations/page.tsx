import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; status?: string }>;
const statuses = ["draft", "published", "unpublished"] as const;

function sanitizeSearch(value: string | undefined) {
  return value?.trim().slice(0, 80).replace(/[,%_().\\]/g, " ").replace(/\\s+/g, " ") ?? "";
}

function statusVariant(status: string) {
  if (status === "published") return "default" as const;
  if (status === "unpublished") return "secondary" as const;
  return "outline" as const;
}

export default async function AdminInvitationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = sanitizeSearch(params.q);
  const status = statuses.find((value) => value === params.status) ?? "";
  const supabase = await createClient();
  let request = supabase
    .from("invitations")
    .select("id,title,slug,status,created_at,profiles(full_name,email),themes(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);
  if (status) request = request.eq("status", status);
  if (query) request = request.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
  const { data: invitations, count, error } = await request;

  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Undangan</h1>
        <p className="text-muted-foreground">Cari dan pantau undangan yang dibuat pengguna.</p>
      </header>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Daftar Undangan</CardTitle>
          <CardDescription>
            {error ? "Jumlah undangan tidak dapat dimuat." : `${(count ?? 0).toLocaleString("id-ID")} undangan`}
            {count !== null && count > 100 ? " · Menampilkan 100 hasil terbaru" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/invitations" className="flex flex-col gap-2 sm:flex-row">
            <Input name="q" defaultValue={query} placeholder="Cari judul atau slug..." aria-label="Cari undangan" />
            <select name="status" defaultValue={status} aria-label="Filter status undangan" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Semua status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
            <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Terapkan</button>
          </form>
          {error ? (
            <p role="alert" className="py-8 text-center text-sm text-destructive">Data undangan gagal dimuat. Periksa izin baca admin dan relasi database.</p>
          ) : invitations?.length ? (
            <div className="backend-table-container">
              <Table>
                <TableHeader className="bg-muted/70">
                  <TableRow><TableHead>Undangan</TableHead><TableHead>Pemilik</TableHead><TableHead>Tema</TableHead><TableHead>Status</TableHead><TableHead>Dibuat</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => {
                    const owner = Array.isArray(invitation.profiles) ? invitation.profiles[0] : invitation.profiles;
                    const theme = Array.isArray(invitation.themes) ? invitation.themes[0] : invitation.themes;
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="min-w-44">
                          <p className="font-medium">{invitation.title || "Tanpa judul"}</p>
                          <Link href={`/${invitation.slug}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary hover:underline">{invitation.slug}</Link>
                        </TableCell>
                        <TableCell>{owner?.full_name || owner?.email || "Pengguna"}</TableCell>
                        <TableCell>{theme?.name || "Tema tidak diketahui"}</TableCell>
                        <TableCell><Badge variant={statusVariant(invitation.status)}>{invitation.status}</Badge></TableCell>
                        <TableCell>{new Date(invitation.created_at).toLocaleDateString("id-ID")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada undangan yang cocok dengan filter.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
