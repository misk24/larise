import { InvitationView } from "@/components/invitation/invitation-view"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase.from("invitations").select("*").eq("slug", slug).single()

  if (!invitation) {
    return { title: "Undangan Tidak Ditemukan" }
  }

  return {
    title: `Undangan Pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
    description: `Anda diundang ke pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
    openGraph: {
      title: `Undangan Pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
      description: `Anda diundang ke pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
      type: "website",
    },
  }
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { to } = await searchParams
  const supabase = await createClient()

  const { data: invitation } = await supabase.from("invitations").select("*, themes(*)").eq("slug", slug).single()

  if (!invitation || !invitation.is_published) {
    notFound()
  }

  // Get wishes for this invitation
  const { data: wishes } = await supabase
    .from("wishes")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false })
    .limit(50)

  return <InvitationView invitation={invitation} guestName={to || "Tamu Undangan"} wishes={wishes || []} />
}
