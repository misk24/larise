import { InvitationMediaUploader } from "@/components/dashboard/invitation-media-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ImageIcon, ImagesIcon } from "lucide-react";
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
      <div className="backend-content space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Galeri Foto</h1>
          <p className="text-muted-foreground">Kelola foto untuk setiap undangan Anda.</p>
        </div>
        <Card className="shadow-none"><CardContent className="p-6 text-sm text-destructive">Daftar undangan gagal dimuat. Coba muat ulang halaman.</CardContent></Card>
      </div>
    );
  }

  const invitationList = invitations ?? [];
  const selectedInvitation = invitationList.find((item) => item.id === params.invitation) ?? invitationList[0];

  if (!selectedInvitation) {
    return (
      <div className="backend-content space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Galeri Foto</h1>
          <p className="text-muted-foreground">Kelola foto untuk setiap undangan Anda.</p>
        </div>
        <Card className="border-dashed shadow-none">
          <CardContent className="p-10 text-center">
            <ImageIcon className="mx-auto mb-3 size-10 text-muted-foreground/50" />
            <h2 className="font-semibold">Belum ada undangan</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Buat undangan terlebih dahulu. Setelah itu, Anda bisa mengunggah dan mengelola foto dari halaman ini.</p>
            <Button asChild className="mt-5"><Link href="/dashboard/invitations/create">Buat Undangan</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: media, error: mediaError } = await supabase
    .from("invitation_media")
    .select("*")
    .eq("invitation_id", selectedInvitation.id)
    .order("created_at", { ascending: true });

  const coupleNames = selectedInvitation.name_order === "bride_first"
    ? `${selectedInvitation.bride_name || "Mempelai wanita"} & ${selectedInvitation.groom_name || "Mempelai pria"}`
    : `${selectedInvitation.groom_name || "Mempelai pria"} & ${selectedInvitation.bride_name || "Mempelai wanita"}`;

  return (
    <div className="backend-content mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Konten Undangan</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Galeri Foto</h1>
          <p className="text-sm text-muted-foreground">Unggah dan kelola foto yang akan digunakan pada undangan Anda.</p>
        </div>
        <Button variant="outline" asChild><Link href={`/dashboard/invitations/${selectedInvitation.id}/builder`}>Buka builder undangan</Link></Button>
      </div>

      {invitationList.length > 1 ? (
        <form action="/dashboard/gallery" method="get" className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="gallery-invitation" className="text-sm font-medium">Pilih undangan</label>
          <select id="gallery-invitation" name="invitation" defaultValue={selectedInvitation.id} onChange={undefined} className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm sm:min-w-72">
            {invitationList.map((invitation) => (
              <option key={invitation.id} value={invitation.id}>
                {invitation.name_order === "bride_first" ? invitation.bride_name : invitation.groom_name} & {invitation.name_order === "bride_first" ? invitation.groom_name : invitation.bride_name} · /{invitation.slug}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">Tampilkan</Button>
        </form>
      ) : null}

      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ImagesIcon className="size-5" /></div>
            <div className="min-w-0">
              <CardTitle className="text-base">{coupleNames}</CardTitle>
              <CardDescription className="mt-1">/{selectedInvitation.slug} · {media?.length ?? 0} foto tersimpan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediaError ? (
            <p className="text-sm text-destructive">Data galeri gagal dimuat. Periksa koneksi database dan kebijakan akses media.</p>
          ) : (
            <InvitationMediaUploader invitationId={selectedInvitation.id} initialMedia={(media ?? []) as InvitationMedia[]} />
          )}
          <p className="text-xs leading-5 text-muted-foreground">Format JPG, PNG, atau WebP dengan ukuran maksimum 5 MB per file. Foto hanya dikelola pada undangan yang sedang dipilih.</p>
        </CardContent>
      </Card>
    </div>
  );
}
