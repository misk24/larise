import { BackendEmptyState, BackendErrorState, BackendPageHeader, BackendStatCard, BackendStatGrid, BackendStatusBadge } from "@/components/backend/backend-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2Icon, Clock3Icon, UsersIcon, XCircleIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function RsvpDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invitations, error: invitationsError } = await supabase
    .from("invitations").select("id,slug,groom_name,bride_name,is_published")
    .eq("user_id", user.id).order("created_at", { ascending: false });

  if (invitationsError) {
    return (
      <div className="backend-content space-y-8">
        <BackendPageHeader title="Ringkasan RSVP" description="Pantau respons kehadiran dari semua undangan Anda." />
        <BackendErrorState title="Data undangan gagal dimuat" description="Muat ulang halaman atau periksa koneksi Anda." />
      </div>
    );
  }

  const list = invitations ?? [];
  const ids = list.map((item) => item.id);
  const { data: rsvps, error: rsvpError } = ids.length
    ? await supabase.from("rsvps").select("id,invitation_id,guest_id,status,attendee_count,message,updated_at").in("invitation_id", ids).order("updated_at", { ascending: false })
    : { data: [], error: null };

  const rows = rsvps ?? [];
  const attending = rows.filter((row) => row.status === "attending");
  const notAttending = rows.filter((row) => row.status === "not_attending");
  const pending = rows.filter((row) => row.status === "pending");
  const metrics = [
    { label: "Konfirmasi hadir", value: attending.reduce((sum, row) => sum + (row.attendee_count ?? 1), 0), icon: CheckCircle2Icon },
    { label: "Tidak hadir", value: notAttending.length, icon: XCircleIcon },
    { label: "Menunggu", value: pending.length, icon: Clock3Icon },
    { label: "Total respons", value: rows.length, icon: UsersIcon },
  ];

  const { data: guests, error: guestsError } = rows.length
    ? await supabase.from("guests").select("id,name,phone").in("id", rows.map((row) => row.guest_id))
    : { data: [], error: null };
  const guestById = new Map((guests ?? []).map((guest) => [guest.id, guest]));
  const invitationById = new Map(list.map((invitation) => [invitation.id, invitation]));

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader title="Ringkasan RSVP" description="Pantau respons kehadiran dari semua undangan Anda." />
      <BackendStatGrid aria-label="Ringkasan respons">
        {metrics.map((metric) => <BackendStatCard key={metric.label} label={metric.label} value={metric.value.toLocaleString("id-ID")} icon={metric.icon} />)}
      </BackendStatGrid>
      <Card>
        <CardHeader><CardTitle role="heading" aria-level={2} className="text-base">Respons terbaru</CardTitle><CardDescription>Respons tamu yang terkait dengan undangan milik Anda.</CardDescription></CardHeader>
        <CardContent>
          {rsvpError ? <BackendErrorState title="Data RSVP gagal dimuat" description="Muat ulang halaman atau periksa koneksi Anda." /> : guestsError ? <BackendErrorState title="Data tamu gagal dimuat" description="Respons RSVP tersedia, tetapi nama tamu belum bisa ditampilkan." /> : rows.length ? (
            <div className="space-y-0">
              {rows.map((row) => {
                const guest = guestById.get(row.guest_id);
                const invitation = invitationById.get(row.invitation_id);
                const status = row.status === "attending" ? "Hadir" : row.status === "not_attending" ? "Tidak hadir" : "Menunggu";
                return <div key={row.id} className="flex flex-col gap-2 border-b py-4 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0"><p className="font-medium">{guest?.name ?? "Tamu"}</p><p className="text-sm text-muted-foreground">{invitation ? `${invitation.groom_name || "Mempelai"} & ${invitation.bride_name || "Mempelai"}` : "Undangan"} · {guest?.phone ?? "Tanpa nomor telepon"}</p>{row.message ? <p className="mt-2 text-sm">{row.message}</p> : null}</div>
                  <div className="flex shrink-0 items-center gap-3"><BackendStatusBadge tone={row.status === "attending" ? "success" : row.status === "not_attending" ? "danger" : "neutral"}>{status}{row.status === "attending" && row.attendee_count > 1 ? ` · ${row.attendee_count} orang` : ""}</BackendStatusBadge><span className="text-xs text-muted-foreground">{new Date(row.updated_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}</span></div>
                </div>;
              })}
            </div>
          ) : <BackendEmptyState icon={UsersIcon} title="Belum ada respons RSVP" description="Respons tamu akan muncul di sini setelah mereka mengisi RSVP dari undangan publik." className="min-h-40 border-0 bg-transparent" />}
        </CardContent>
      </Card>
    </div>
  );
}
