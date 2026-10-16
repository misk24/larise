import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PublicUrlActions } from "@/components/dashboard/public-url-actions";
import { ArrowRightIcon, CheckCircle2Icon, EyeIcon, FileTextIcon, MessageSquareHeartIcon, PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invitations, error } = await supabase
    .from("invitations")
    .select("id, slug, groom_name, bride_name, resepsi_date, status, is_published, view_count, created_at, themes(name), guests(count), wishes(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <Card><CardContent className="p-8 text-sm text-destructive">Dashboard gagal memuat data undangan. Muat ulang halaman atau periksa koneksi database.</CardContent></Card>;
  }

  const invitationList = invitations ?? [];
  const invitationIds = invitationList.map((item) => item.id);
  const { data: rsvps } = invitationIds.length
    ? await supabase.from("rsvps").select("invitation_id, status, attendee_count").in("invitation_id", invitationIds)
    : { data: [] };

  const totalGuests = invitationList.reduce((sum, item) => sum + (item.guests?.[0]?.count ?? 0), 0);
  const totalWishes = invitationList.reduce((sum, item) => sum + (item.wishes?.[0]?.count ?? 0), 0);
  const confirmedRsvps = (rsvps ?? []).filter((rsvp) => rsvp.status === "attending");
  const attendingPeople = confirmedRsvps.reduce((sum, rsvp) => sum + (rsvp.attendee_count ?? 1), 0);
  const publishedCount = invitationList.filter((item) => item.is_published).length;
  const stats = [
    { title: "Total Undangan", value: invitationList.length, icon: FileTextIcon },
    { title: "Undangan Terbit", value: publishedCount, icon: EyeIcon },
    { title: "Total Tamu", value: totalGuests, icon: UsersIcon },
    { title: "Konfirmasi Hadir", value: attendingPeople, icon: CheckCircle2Icon },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Ringkasan dan pintasan untuk semua undangan Anda.</p>
        </div>
        <Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="mr-2 size-4" />Buat Undangan</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><stat.icon className="size-5" /></div>
              <div><p className="text-2xl font-semibold tabular-nums">{stat.value.toLocaleString("id-ID")}</p><p className="text-sm text-muted-foreground">{stat.title}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-lg font-semibold">Undangan Anda</h2><p className="text-sm text-muted-foreground">Status publikasi dan pintasan pengelolaan.</p></div>
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/invitations">Semua undangan</Link></Button>
          </div>
          {invitationList.length ? invitationList.map((invitation) => {
            const theme = Array.isArray(invitation.themes) ? invitation.themes[0] : invitation.themes;
            const guestCount = invitation.guests?.[0]?.count ?? 0;
            const wishCount = invitation.wishes?.[0]?.count ?? 0;
            return (
              <Card key={invitation.id} className="shadow-none">
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{invitation.groom_name || "Mempelai pria"} &amp; {invitation.bride_name || "mempelai wanita"}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{theme?.name ?? "Tema belum dipilih"} · /{invitation.slug}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{invitation.resepsi_date ? new Date(invitation.resepsi_date).toLocaleDateString("id-ID", { dateStyle: "long" }) : "Tanggal acara belum diatur"}</p>
                    </div>
                    <span className={invitation.is_published ? "w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300" : "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"}>{invitation.is_published ? "Dipublikasikan" : invitation.status === "unpublished" ? "Tidak dipublikasikan" : "Draft"}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><span>{guestCount} tamu</span><span>{wishCount} ucapan</span><span>{invitation.view_count ?? 0} kunjungan</span></div>
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    <Button size="sm" asChild><Link href={`/dashboard/invitations/${invitation.id}`}>Kelola undangan <ArrowRightIcon className="ml-2 size-3.5" /></Link></Button>
                    <Button size="sm" variant="outline" asChild><Link href={`/dashboard/invitations/${invitation.id}/builder`}>Edit isi</Link></Button>
                    {invitation.is_published ? <><Button size="sm" variant="outline" asChild><Link href={`/${invitation.slug}`} target="_blank" rel="noreferrer"><EyeIcon className="mr-2 size-3.5" />Lihat publik</Link></Button><PublicUrlActions slug={invitation.slug} /></> : null}
                  </div>
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="border-dashed shadow-none"><CardContent className="p-10 text-center">
              <FileTextIcon className="mx-auto mb-3 size-10 text-muted-foreground/50" />
              <h3 className="font-semibold">Belum ada undangan</h3><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Buat undangan pertama, pilih tema, lalu isi detail acara sebelum membagikannya.</p>
              <Button className="mt-5" asChild><Link href="/dashboard/invitations/create"><PlusIcon className="mr-2 size-4" />Buat undangan pertama</Link></Button>
            </CardContent></Card>
          )}
        </section>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-base">Aksi cepat</CardTitle><CardDescription>Akses fitur yang paling sering dipakai.</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild><Link href="/dashboard/invitations"><FileTextIcon className="mr-3 size-4" />Kelola undangan</Link></Button>
              <Button variant="outline" className="w-full justify-start" asChild><Link href="/dashboard/guests"><UsersIcon className="mr-3 size-4" />Daftar tamu</Link></Button>
              <Button variant="outline" className="w-full justify-start" asChild><Link href="/dashboard/rsvp"><CheckCircle2Icon className="mr-3 size-4" />Ringkasan RSVP</Link></Button>
              <Button variant="outline" className="w-full justify-start" asChild><Link href="/dashboard/wishes"><MessageSquareHeartIcon className="mr-3 size-4" />Moderasi ucapan</Link></Button>
              <Button variant="outline" className="w-full justify-start" asChild><Link href="/dashboard/settings">Pengaturan akun</Link></Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-base">Ringkasan RSVP</CardTitle><CardDescription>Respons tamu dari seluruh undangan.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Hadir</span><strong>{attendingPeople}</strong></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Tidak hadir</span><strong>{(rsvps ?? []).filter((rsvp) => rsvp.status === "not_attending").length}</strong></div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Menunggu</span><strong>{(rsvps ?? []).filter((rsvp) => rsvp.status === "pending").length}</strong></div>
              <div className="flex items-center justify-between border-t pt-3 text-sm"><span className="text-muted-foreground">Total ucapan</span><strong>{totalWishes}</strong></div>
              <Button variant="link" className="h-auto px-0" asChild><Link href="/dashboard/rsvp">Lihat detail RSVP <ArrowRightIcon className="ml-2 size-3.5" /></Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
