import { BackendErrorState, BackendPageHeader } from "@/components/backend/backend-ui";
import { coupleNames } from "@/components/backend/invitation-meta";
import { InvitationBuilder } from "@/components/dashboard/invitation-builder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function InvitationBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [invitationResult, sectionsResult, wishesResult, mediaResult] = await Promise.all([
    supabase
      .from("invitations")
      .select("*, themes(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("invitation_sections")
      .select("*")
      .eq("invitation_id", id)
      .order("position"),
    supabase
      .from("wishes")
      .select("*")
      .eq("invitation_id", id)
      .eq("visibility", "visible")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("invitation_media").select("*").eq("invitation_id", id).order("created_at"),
  ]);

  // Keep missing/foreign invitations indistinguishable, but do not mask database failures as 404s.
  if (invitationResult.error) {
    console.error("[InvitationBuilderPage] Failed to load invitation.", {
      invitationId: id,
      code: invitationResult.error.code,
    });
    return <BuilderLoadError retryHref={`/dashboard/invitations/${id}/builder`} />;
  }

  const invitation = invitationResult.data;
  if (!invitation) notFound();

  const failedResource = [
    sectionsResult.error && "konten undangan",
    wishesResult.error && "ucapan",
    mediaResult.error && "media",
  ].filter(Boolean);

  if (failedResource.length > 0) {
    console.error("[InvitationBuilderPage] Failed to load builder resources.", {
      invitationId: id,
      sectionsError: sectionsResult.error?.code,
      wishesError: wishesResult.error?.code,
      mediaError: mediaResult.error?.code,
    });
    return <BuilderLoadError retryHref={`/dashboard/invitations/${id}/builder`} resources={failedResource as string[]} />;
  }

  return (
    <div className="backend-content mx-auto max-w-[1800px] space-y-5">
      <BackendPageHeader
        title={coupleNames(invitation)}
        description="Edit konten, visibilitas, dan urutan, lalu pratinjau sebelum publikasi."
        actions={
          <Button variant="outline" asChild>
            <a href={`/${invitation.slug}`} target="_blank" rel="noreferrer">Buka undangan publik</a>
          </Button>
        }
      />
      <InvitationBuilder
        invitation={invitation}
        initialSections={sectionsResult.data ?? []}
        wishes={wishesResult.data ?? []}
        media={mediaResult.data ?? []}
      />
    </div>
  );
}

function BuilderLoadError({ retryHref, resources }: { retryHref: string; resources?: string[] }) {
  return (
    <div className="backend-content mx-auto max-w-2xl space-y-8">
      <BackendErrorState
        title="Data builder gagal dimuat"
        description={
          resources?.length
            ? `Sebagian data (${resources.join(", ")}) tidak berhasil dimuat. Builder tidak dibuka agar data yang tampak kosong tidak menyesatkan.`
            : "Data undangan tidak berhasil dimuat. Coba muat ulang halaman."
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild><Link href={retryHref}>Muat ulang</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link href="/dashboard/invitations">Kembali ke undangan</Link></Button>
          </div>
        }
      />
    </div>
  );
}
