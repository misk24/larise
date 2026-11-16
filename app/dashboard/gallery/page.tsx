import { BackendEmptyState, BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { BackendInvitationPicker } from "@/components/backend/invitation-picker";
import { coupleNames } from "@/components/backend/invitation-meta";
import { InvitationMediaUploader } from "@/components/dashboard/invitation-media-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ImageIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { InvitationMedia } from "@/types/database";

type GalleryPageProps = {
  searchParams: Promise<{ invitation?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
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
        <BackendPageHeader title="Galeri Foto" description="Kelola foto untuk setiap undangan Anda." />
        <BackendErrorState title="Daftar undangan gagal dimuat" description="Coba muat ulang halaman." />
      </div>
    );
  }

  const invitationList = invitations ?? [];
  const selectedInvitation = invitationList.find((item) => item.id === params.invitation) ?? invitationList[0];

  if (!selectedInvitation) {
    return (
      <div className="backend-content space-y-8">
        <BackendPageHeader title="Galeri Foto" description="Kelola foto untuk setiap undangan Anda." />
        <BackendEmptyState
          icon={ImageIcon}
          title="Belum ada undangan"
          description="Buat undangan terlebih dahulu. Setelah itu, Anda bisa mengunggah dan mengelola foto dari halaman ini."
          action={<Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4" />Buat Undangan</Link></Button>}
        />
      </div>
    );
  }

  const { data: media, error: mediaError } = await supabase
    .from("invitation_media")
    .select("*")
    .eq("invitation_id", selectedInvitation.id)
    .order("created_at", { ascending: true });

  return (
    <div className="backend-content mx-auto w-full max-w-5xl space-y-8">
      <BackendPageHeader
        title="Galeri Foto"
        description="Unggah dan kelola foto yang akan digunakan pada undangan Anda."
        actions={<Button variant="outline" asChild><Link href={`/dashboard/invitations/${selectedInvitation.id}/builder`}>Buka builder undangan</Link></Button>}
      />

      <BackendInvitationPicker action="/dashboard/gallery" invitations={invitationList} selectedId={selectedInvitation.id} />

      <Card>
        <CardHeader>
          <CardTitle role="heading" aria-level={2} className="text-base">{coupleNames(selectedInvitation)}</CardTitle>
          <CardDescription>/{selectedInvitation.slug} · {media?.length ?? 0} foto tersimpan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediaError ? (
            <BackendErrorState title="Data galeri gagal dimuat" description="Periksa koneksi database dan kebijakan akses media, lalu muat ulang." />
          ) : (
            <InvitationMediaUploader invitationId={selectedInvitation.id} initialMedia={(media ?? []) as InvitationMedia[]} />
          )}
          <p className="text-xs leading-5 text-muted-foreground">Format JPG, PNG, atau WebP dengan ukuran maksimum 5 MB per file. Foto hanya dikelola pada undangan yang sedang dipilih.</p>
        </CardContent>
      </Card>
    </div>
  );
}
