import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function AdminInvitationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 100) ?? "";
  const status = ["draft", "published", "unpublished"].includes(params.status ?? "") ? params.status : "";
  const supabase = await createClient();
  let request = supabase.from("invitations").select("id,title,slug,status,created_at,user_id,profiles(full_name,email),themes(name)").order("created_at", { ascending: false }).limit(100);
  if (status) request = request.eq("status", status);
  if (query) request = request.or(`title.ilike.%${query.replace(/[%_,().]/g, " ")}%,slug.ilike.%${query.replace(/[%_,().]/g, " ")}%`);
  const { data: invitations, error } = await request;
  return <div className="space-y-6">
    <div><h1 className="text-2xl md:text-3xl font-medium">Kelola Undangan</h1><p className="text-muted-foreground">Cari dan pantau undangan yang dibuat pengguna.</p></div>
    <Card className="border-border bg-sidebar"><CardHeader><CardTitle>Daftar Undangan</CardTitle><CardDescription>{invitations?.length ?? 0} hasil (maksimal 100)</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <form className="flex flex-col gap-2 sm:flex-row" action="/admin/invitations">
          <Input name="q" placeholder="Cari judul atau slug..." defaultValue={query} aria-label="Cari undangan" />
          <select name="status" defaultValue={status} aria-label="Filter status" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Semua status</option><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option>
          </select><button className="h-10 rounded-md bg-primary px-4 text-primary-foreground text-sm font-medium" type="submit">Terapkan</button>
        </form>
        {error ? <p role="alert" className="text-sm text-destructive">Data undangan gagal dimuat. Periksa izin database dan relasi profil/tema.</p> : invitations?.length ? <div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead>Undangan</TableHead><TableHead>Pemilik</TableHead><TableHead>Tema</TableHead><TableHead>Status</TableHead><TableHead>Dibuat</TableHead></TableRow></TableHeader>
          <TableBody>{invitations.map((item) => <TableRow key={item.id}><TableCell><div className="font-medium">{item.title || "Tanpa judul"}</div><Link className="text-xs text-muted-foreground hover:underline" href={`/undangan/${item.slug}`} target="_blank">{item.slug}</Link></TableCell>
            <TableCell>{item.profiles?.[0]?.full_name || item.profiles?.[0]?.email || "Pengguna"}</TableCell><TableCell>{item.themes?.[0]?.name || "Tema tidak diketahui"}</TableCell><TableCell><Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge></TableCell><TableCell>{new Date(item.created_at).toLocaleDateString("id-ID")}</TableCell></TableRow>)}</TableBody></Table></div> : <p className="py-10 text-center text-muted-foreground">Tidak ada undangan yang cocok dengan filter.</p>}
      </CardContent></Card></div>;
}