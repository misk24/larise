import { InvitationView } from "@/components/invitation/invitation-view";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

function invitationTitle(invitation: { groom_name: string; bride_name: string; name_order?: string }) {
  const firstName = invitation.name_order === "bride_first" ? invitation.bride_name : invitation.groom_name;
  const secondName = invitation.name_order === "bride_first" ? invitation.groom_name : invitation.bride_name;
  return `Undangan Pernikahan ${firstName} & ${secondName}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("slug, status, is_published, groom_name, bride_name, name_order")
    .eq("slug", slug)
    .maybeSingle();

  // Draft and unpublished invitations must not leak names through social previews.
  if (!invitation || invitation.status !== "published" || !invitation.is_published) {
    return {
      title: "Undangan Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const title = invitationTitle(invitation);
  const description = `Anda diundang untuk merayakan pernikahan ${invitation.groom_name} & ${invitation.bride_name}.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "id_ID",
      title,
      description,
      siteName: "LARISÉ",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const [{ slug }, { to }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*, themes(*)")
    .eq("slug", slug)
    .maybeSingle();

  // Check both fields: the explicit lifecycle status is authoritative too.
  if (!invitation || invitation.status !== "published" || !invitation.is_published) {
    notFound();
  }

  const [{ data: sections }, { data: wishes }] = await Promise.all([
    supabase
      .from("invitation_sections")
      .select("*")
      .eq("invitation_id", invitation.id)
      .order("position"),
    supabase
      .from("wishes")
      .select("*")
      .eq("invitation_id", invitation.id)
      .eq("visibility", "visible")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <InvitationView
      invitation={invitation}
      sections={sections ?? []}
      guestName={to?.trim() || "Tamu Undangan"}
      wishes={wishes ?? []}
    />
  );
}
