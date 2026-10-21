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
    return <Card><CardContent className="p-8 text-sm text-destructive">Data undangan gagal dimuat. Coba muat ulang halaman.</CardContent></Card>;
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

  const { data: guests } = rows.length
    ? await supabase.from("guests").select("id,name,phone").in("id", rows.map((row) => row.guest_id))
    : { data: [] };
  const guestById = new Map((guests ?? []).map((guest) => [guest.id, guest]));
  const invitationById = new Map(list.map((invitation) => [invitation.id, invitation]));

  return (
    <div className="backend-content space-y-6">
      <div><h1 className="text-2xl font-semibold md:text-3xl">Ringkasan RSVP</h1><p className="mt-1 text-muted-foreground">Pantau respons kehadiran dari semua undangan Anda.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <Card key={metric.label} className="shadow-none"><CardContent className="flex items-center gap-4 p-5"><div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><metric.icon className="size-5" /></div><div><p className="text-2xl font-semibold tabular-nums">{metric.value.toLocaleString("id-ID")}</p><p className="text-sm text-muted-foreground">{metric.label}</p></div></CardContent></Card>)}
      </div>
      <Card className="shadow-none">
        <CardHeader><CardTitle>Respons terbaru</CardTitle><CardDescription>Respons tamu yang terkait dengan undangan milik Anda.</CardDescription></CardHeader>
        <CardContent>
          {rsvpError ? <p className="text-sm text-destructive">Data RSVP gagal dimuat. Periksa koneksi database dan kebijakan akses.</p> : rows.length ? (
            <div className="space-y-0">
              {rows.map((row) => {
                const guest = guestById.get(row.guest_id);
                const invitation = invitationById.get(row.invitation_id);
                const status = row.status === "attending" ? "Hadir" : row.status === "not_attending" ? "Tidak hadir" : "Menunggu";
                return <div key={row.id} className="flex flex-col gap-2 border-b py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0"><p className="font-medium">{guest?.name ?? "Tamu"}</p><p className="text-sm text-muted-foreground">{invitation ? `${invitation.groom_name || "Mempelai"} & ${invitation.bride_name || "Mempelai"}` : "Undangan"} · {guest?.phone ?? "Tanpa nomor telepon"}</p>{row.message ? <p className="mt-2 text-sm">{row.message}</p> : null}</div>
                  <div className="flex shrink-0 items-center gap-3"><span className={row.status === "attending" ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300" : row.status === "not_attending" ? "rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive" : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"}>{status}{row.status === "attending" && row.attendee_count > 1 ? ` · ${row.attendee_count} orang` : ""}</span><span className="text-xs text-muted-foreground">{new Date(row.updated_at).toLocaleDateString("id-ID")}</span></div>
                </div>;
              })}
            </div>
          ) : <div className="py-10 text-center"><UsersIcon className="mx-auto mb-3 size-9 text-muted-foreground/50" /><p className="font-medium">Belum ada respons RSVP</p><p className="mt-1 text-sm text-muted-foreground">Respons tamu akan muncul di sini setelah mereka mengisi RSVP dari undangan publik.</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
