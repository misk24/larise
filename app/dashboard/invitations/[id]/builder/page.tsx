import { InvitationBuilder } from "@/components/dashboard/invitation-builder";
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
    return <BuilderLoadError />;
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
    return <BuilderLoadError resources={failedResource as string[]} />;
  }

  return (
    <div className="backend-content mx-auto max-w-[1800px] space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Builder</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {invitation.name_order === "bride_first"
              ? `${invitation.bride_name} & ${invitation.groom_name}`
              : `${invitation.groom_name} & ${invitation.bride_name}`}
          </h1>
          <p className="text-muted-foreground">Edit konten, visibility, urutan, lalu preview sebelum publish.</p>
        </div>
        <a
          href={`/${invitation.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
        >
          Buka undangan publik
        </a>
      </div>
      <InvitationBuilder
        invitation={invitation}
        initialSections={sectionsResult.data ?? []}
        wishes={wishesResult.data ?? []}
        media={mediaResult.data ?? []}
      />
    </div>
  );
}

function BuilderLoadError({ resources }: { resources?: string[] }) {
  return (
    <div className="backend-content mx-auto max-w-2xl space-y-4">
      <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <h1 className="text-lg font-semibold">Data builder gagal dimuat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {resources?.length
            ? `Sebagian data (${resources.join(", ")}) tidak berhasil dimuat. Builder tidak dibuka agar data yang tampak kosong tidak menyesatkan.`
            : "Data undangan tidak berhasil dimuat. Coba muat ulang halaman."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={typeof window === "undefined" ? "#" : "#"} className="hidden" aria-hidden="true">Retry</a>
          <a href="" className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted">
            Muat ulang halaman
          </a>
          <a href="/dashboard/invitations" className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium hover:bg-muted">
            Kembali ke undangan
          </a>
        </div>
      </div>
    </div>
  );
}
