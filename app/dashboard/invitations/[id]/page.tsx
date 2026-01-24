import { EditInvitationForm } from "@/components/dashboard/edit-invitation-form"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: invitation } = await supabase.from("invitations").select("*, templates(*)").eq("id", id).single()

  if (!invitation || invitation.user_id !== user.id) {
    notFound()
  }

  const { data: templates } = await supabase.from("templates").select("*").eq("is_active", true).order("name")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">Edit Undangan</h1>
        <p className="text-muted-foreground">Perbarui detail undangan pernikahan Anda</p>
      </div>

      <EditInvitationForm invitation={invitation} templates={templates || []} />
    </div>
  )
}
