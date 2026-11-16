import { BackendEmptyState, BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { InvitationStatusBadge, coupleNames } from "@/components/backend/invitation-meta";
import { InvitationActions } from "@/components/dashboard/invitation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileTextIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function InvitationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invitations, error } = await supabase
    .from("invitations")
    .select(
      "id,theme_id,slug,status,is_published,created_at,updated_at,view_count,groom_name,bride_name,name_order,themes(name,category,is_premium)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    return (
      <div className="backend-content space-y-6">
        <BackendPageHeader title="Undangan Saya" description="Kelola draft, tema, duplikasi, dan status publikasi." />
        <BackendErrorState title="Daftar undangan gagal dimuat" description="Muat ulang halaman atau periksa koneksi Anda." />
      </div>
    );
  }

  return (
    <div className="backend-content space-y-6">
      <BackendPageHeader
        title="Undangan Saya"
        description="Kelola draft, tema, duplikasi, dan status publikasi."
        actions={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat Undangan</Link></Button>}
      />
      {invitations?.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {invitations.map((invitation) => {
            const theme = Array.isArray(invitation.themes) ? invitation.themes[0] : invitation.themes;
            return (
              <Card key={invitation.id} className="gap-0 overflow-hidden py-0 shadow-none transition-colors hover:border-primary/30">
                <div className="flex aspect-[16/9] items-center justify-center bg-muted/60 p-4 text-center">
                  <p className="text-balance text-xl font-semibold tracking-tight">{coupleNames(invitation)}</p>
                </div>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium">{theme?.name ?? "Tanpa tema"}</p>
                      <p className="truncate text-muted-foreground">/{invitation.slug}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Dibuat {new Date(invitation.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </p>
                    </div>
                    <InvitationStatusBadge published={invitation.is_published} status={invitation.status} />
                  </div>
                  <InvitationActions invitationId={invitation.id} published={invitation.is_published} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <BackendEmptyState
          icon={FileTextIcon}
          title="Belum ada undangan"
          description="Buat draft pertama Anda dari salah satu tema yang tersedia."
          action={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat Undangan</Link></Button>}
        />
      )}
    </div>
  );
}
