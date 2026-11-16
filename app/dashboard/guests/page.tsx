import { BackendEmptyState, BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { BackendInvitationPicker } from "@/components/backend/invitation-picker";
import { GuestManager } from "@/components/dashboard/guest-manager";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { PlusIcon, UsersIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

type GuestsPageProps = {
  searchParams: Promise<{ invitation?: string }>;
};

export default async function GuestsPage({ searchParams }: GuestsPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const { data: invitations, error: invitationsError } = await supabase
    .from("invitations")
    .select("id, slug, groom_name, bride_name, name_order")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (invitationsError) {
    return (
      <div className="backend-content space-y-8">
        <BackendPageHeader title="Daftar Tamu" description="Kelola kontak, tautan personal, dan konfirmasi kehadiran." />
        <BackendErrorState title="Daftar undangan gagal dimuat" description="Muat ulang halaman atau periksa koneksi database." />
      </div>
    );
  }

  const invitationList = invitations ?? [];
  const invitation = invitationList.find((item) => item.id === params.invitation) ?? invitationList[0];

  if (!invitation) {
    return (
      <div className="backend-content space-y-8">
        <BackendPageHeader title="Daftar Tamu" description="Kelola kontak, tautan personal, dan konfirmasi kehadiran." />
        <BackendEmptyState
          icon={UsersIcon}
          title="Belum ada undangan"
          description="Buat undangan terlebih dahulu untuk mulai mengelola daftar tamu."
          action={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat Undangan</Link></Button>}
        />
      </div>
    );
  }

  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select("*, rsvp:rsvps(*)")
    .eq("invitation_id", invitation.id)
    .order("name");

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader title="Daftar Tamu" description="Kelola kontak, tautan personal, dan konfirmasi kehadiran." />

      <BackendInvitationPicker action="/dashboard/guests" invitations={invitationList} selectedId={invitation.id} />
      {invitationList.length < 2 ? (
        <p className="text-sm text-muted-foreground">
          Undangan: <span className="font-medium text-foreground">/{invitation.slug}</span>
        </p>
      ) : null}

      {guestsError ? (
        <BackendErrorState title="Daftar tamu gagal dimuat" description="Periksa kebijakan akses database, lalu coba lagi." />
      ) : (
        <GuestManager
          key={invitation.id}
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          initialGuests={guests ?? []}
        />
      )}
    </div>
  );
}
