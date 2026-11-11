import { InvitationView } from "@/components/invitation/invitation-view";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; guest?: string }>;
}

function invitationTitle(invitation: { groom_name: string; bride_name: string; name_order?: string }) {
  const firstName = invitation.name_order === "bride_first" ? invitation.bride_name : invitation.groom_name;
  const secondName = invitation.name_order === "bride_first" ? invitation.groom_name : invitation.bride_name;
  return `Undangan Pernikahan ${firstName} & ${secondName}`;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ slug }, { guest }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("slug, status, is_published, groom_name, bride_name, name_order")
    .eq("slug", slug)
    .maybeSingle();

  if (!invitation || invitation.status !== "published" || !invitation.is_published) {
    return { title: "Undangan Tidak Ditemukan", robots: { index: false, follow: false } };
  }

  const title = invitationTitle(invitation);
  const description = `Anda diundang untuk merayakan pernikahan ${invitation.groom_name} & ${invitation.bride_name}.`;
  // A personal link carries the guest's private token in the URL. Keep those URLs out
  // of search results and never send them as a referrer to other sites.
  const isPersonalLink = Boolean(guest);
  return {
    title, description,
    robots: isPersonalLink ? { index: false, follow: false } : { index: true, follow: true },
    ...(isPersonalLink ? { referrer: "same-origin" as const } : {}),
    openGraph: { type: "website", locale: "id_ID", title, description, siteName: "LARISÉ" },
    twitter: { card: "summary", title, description },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const [{ slug }, { guest }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations").select("*, themes(*)").eq("slug", slug).maybeSingle();

  if (!invitation || invitation.status !== "published" || !invitation.is_published) notFound();

  const [{ data: sections }, { data: wishes }, guestResult] = await Promise.all([
    supabase.from("invitation_sections").select("*").eq("invitation_id", invitation.id).order("position"),
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).eq("visibility", "visible").order("created_at", { ascending: false }).limit(50),
    guest ? supabase.rpc("resolve_public_guest", { p_invitation_id: invitation.id, p_guest_token: guest }) : Promise.resolve({ data: null, error: null }),
  ]);

  const validGuest = !guestResult.error && guestResult.data?.[0];
  return (
    <InvitationView
      invitation={invitation}
      sections={sections ?? []}
      guestName={validGuest?.guest_name ?? "Tamu Undangan"}
      guestToken={validGuest ? guest! : null}
      wishes={wishes ?? []}
    />
  );
}
