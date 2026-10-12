import { InvitationBuilder } from "@/components/dashboard/invitation-builder";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function InvitationBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: invitation }, { data: sections }, { data: wishes }, { data: media }] = await Promise.all([
    supabase
      .from("invitations")
      .select("*, themes(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
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

  if (!invitation) notFound();

  return (
    <div className="mx-auto max-w-[1800px] space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Builder</p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {invitation.groom_name} &amp; {invitation.bride_name}
          </h1>
          <p className="text-muted-foreground">Edit konten, visibility, urutan, lalu preview sebelum publish.</p>
        </div>
        <a
          href={`/undangan/${invitation.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
        >
          Buka undangan publik
        </a>
      </div>
      <InvitationBuilder invitation={invitation} initialSections={sections ?? []} wishes={wishes ?? []} media={media ?? []} />
    </div>
  );
}
