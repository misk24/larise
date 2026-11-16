import { BackendEmptyState, BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { BackendInvitationPicker } from "@/components/backend/invitation-picker";
import { WishesManager } from "@/components/dashboard/wishes-manager";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquareHeartIcon } from "lucide-react";

type WishesPageProps = { searchParams: Promise<{ invitation?: string }> };

export default async function WishesPage({ searchParams }: WishesPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const { data: invitations, error: invitationsError } = await supabase
    .from("invitations").select("id, slug, groom_name, bride_name, name_order")
    .eq("user_id", user.id).order("created_at", { ascending: false });
  const invitationList = invitations ?? [];
  const invitation = invitationList.find((item) => item.id === params.invitation) ?? invitationList[0];

  return (
    <div className="backend-content space-y-8">
      <BackendPageHeader title="Ucapan & Doa" description="Moderasi ucapan dari tamu di setiap undangan Anda." />
      {invitationsError ? (
        <BackendErrorState title="Daftar undangan gagal dimuat" description="Muat ulang halaman atau periksa koneksi Anda." />
      ) : !invitation ? (
        <BackendEmptyState
          icon={MessageSquareHeartIcon}
          title="Belum ada undangan"
          description="Buat undangan terlebih dahulu untuk mengelola ucapan."
          action={<Button asChild><Link href="/dashboard/invitations/create">Buat Undangan</Link></Button>}
        />
      ) : (
        <>
          <BackendInvitationPicker action="/dashboard/wishes" invitations={invitationList} selectedId={invitation.id} />
          {invitationList.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Undangan: <span className="font-medium text-foreground">/{invitation.slug}</span>
            </p>
          ) : null}
          <WishesData invitationId={invitation.id} />
        </>
      )}
    </div>
  );
}

async function WishesData({ invitationId }: { invitationId: string }) {
  const supabase = await createClient();
  const { data: wishes, error } = await supabase.from("wishes").select("*").eq("invitation_id", invitationId).order("created_at", { ascending: false });
  if (error) return <BackendErrorState title="Ucapan gagal dimuat" description="Muat ulang halaman untuk mencoba lagi." />;
  return <WishesManager initialWishes={wishes ?? []} />;
}
