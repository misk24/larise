import { Button } from "@/components/ui/button";
import { BackendEmptyState, BackendErrorState, BackendPageHeader, BackendSectionHeader, BackendStatCard, BackendStatGrid } from "@/components/backend/backend-ui";
import { InvitationStatusBadge, coupleNames } from "@/components/backend/invitation-meta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PublicUrlActions } from "@/components/dashboard/public-url-actions";
import { CheckCircle2Icon, ExternalLinkIcon, EyeIcon, FileTextIcon, PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invitations, error } = await supabase
    .from("invitations")
    .select("id, slug, groom_name, bride_name, name_order, event_date, resepsi_date, status, is_published, view_count, created_at, themes(name), guests(count), wishes(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="backend-content space-y-8">
        <BackendPageHeader title="Dashboard" description="Ringkasan dan pintasan untuk semua undangan Anda." />
        <BackendErrorState title="Data undangan gagal dimuat" description="Muat ulang halaman atau periksa koneksi Anda." />
      </div>
    );
  }

  const invitationList = invitations ?? [];
  const invitationIds = invitationList.map((item) => item.id);
  const { data: rsvps, error: rsvpsError } = invitationIds.length
    ? await supabase.from("rsvps").select("invitation_id, status, attendee_count").in("invitation_id", invitationIds)
    : { data: [], error: null };

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

  const rsvpRows = rsvps ?? [];
  const rsvpSummary = [
    { label: "Hadir", value: attendingPeople },
    { label: "Tidak hadir", value: rsvpRows.filter((rsvp) => rsvp.status === "not_attending").length },
    { label: "Menunggu", value: rsvpRows.filter((rsvp) => rsvp.status === "pending").length },
  ];

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader
        title="Dashboard"
        description="Ringkasan semua undangan Anda."
        actions={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat Undangan</Link></Button>}
      />

      <BackendStatGrid aria-label="Statistik">
        {stats.map((stat) => (
          <BackendStatCard key={stat.title} label={stat.title} value={stat.value.toLocaleString("id-ID")} icon={stat.icon} />
        ))}
      </BackendStatGrid>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <section className="min-w-0 space-y-4">
          <BackendSectionHeader
            title="Undangan Anda"
            description="Status publikasi dan pintasan pengelolaan."
            action={<Button variant="outline" size="sm" asChild><Link href="/dashboard/invitations">Semua undangan</Link></Button>}
          />
          {invitationList.length ? (
            <Card className="overflow-hidden py-0 shadow-none">
              <ul className="divide-y">
                {invitationList.map((invitation) => {
                  const theme = Array.isArray(invitation.themes) ? invitation.themes[0] : invitation.themes;
                  const guestCount = invitation.guests?.[0]?.count ?? 0;
                  const wishCount = invitation.wishes?.[0]?.count ?? 0;
                  const eventDate = invitation.event_date || invitation.resepsi_date;
                  return (
                    <li key={invitation.id} className="space-y-3 p-4 transition-colors hover:bg-muted/40 sm:p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{coupleNames(invitation)}</h3>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {theme?.name ?? "Tema belum dipilih"} · /{invitation.slug}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {eventDate ? new Date(`${eventDate}T00:00:00`).toLocaleDateString("id-ID", { dateStyle: "long" }) : "Tanggal acara belum diatur"}
                          </p>
                        </div>
                        <InvitationStatusBadge published={invitation.is_published} status={invitation.status} />
                      </div>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {guestCount} tamu · {wishCount} ucapan · {invitation.view_count ?? 0} kunjungan
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild><Link href={`/dashboard/invitations/${invitation.id}`}>Kelola</Link></Button>
                        <Button size="sm" variant="outline" asChild><Link href={`/dashboard/invitations/${invitation.id}/builder`}>Edit isi</Link></Button>
                        {invitation.is_published ? (
                          <>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/${invitation.slug}`} target="_blank" rel="noreferrer"><ExternalLinkIcon className="size-3.5" />Lihat publik</Link>
                            </Button>
                            <PublicUrlActions slug={invitation.slug} />
                          </>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : (
            <BackendEmptyState
              icon={FileTextIcon}
              title="Belum ada undangan"
              description="Buat undangan pertama, pilih tema, lalu isi detail acara sebelum membagikannya."
              action={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat undangan pertama</Link></Button>}
            />
          )}
        </section>

        <aside className="min-w-0">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Ringkasan RSVP</CardTitle>
              <CardDescription>Respons tamu dari seluruh undangan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {rsvpsError ? (
                <BackendErrorState title="Ringkasan RSVP gagal dimuat" description="Buka halaman RSVP untuk memeriksa detailnya." />
              ) : (
                <dl className="space-y-3 text-sm">
                  {rsvpSummary.map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="font-semibold tabular-nums">{row.value.toLocaleString("id-ID")}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t pt-3">
                    <dt className="text-muted-foreground">Total ucapan</dt>
                    <dd className="font-semibold tabular-nums">{totalWishes.toLocaleString("id-ID")}</dd>
                  </div>
                </dl>
              )}
              <Button variant="outline" size="sm" className="w-full" asChild><Link href="/dashboard/rsvp">Lihat detail RSVP</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
