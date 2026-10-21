import { GuestManager } from "@/components/dashboard/guest-manager";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (invitationError) {
    return (
      <div className="backend-content space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Daftar Tamu</h1>
        <Card className="border-border/50">
          <CardContent className="p-8 text-sm text-destructive">
            Data undangan gagal dimuat. Muat ulang halaman atau periksa koneksi database.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="backend-content space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Daftar Tamu</h1>
          <p className="text-muted-foreground">Kelola daftar tamu undangan Anda</p>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Buat undangan terlebih dahulu untuk mengelola daftar tamu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select("*, rsvp:rsvps(*)")
    .eq("invitation_id", invitation.id)
    .order("name");

  return (
    <div className="backend-content space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Daftar Tamu</h1>
        <p className="text-muted-foreground">Kelola kontak, tautan personal, dan konfirmasi kehadiran.</p>
      </div>
      {guestsError ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-sm text-destructive">
            Daftar tamu gagal dimuat. Periksa kebijakan akses database dan coba lagi.
          </CardContent>
        </Card>
      ) : (
        <GuestManager
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          initialGuests={guests ?? []}
        />
      )}
    </div>
  );
}
