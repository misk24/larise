import { CreateInvitationForm } from "@/components/dashboard/create-invitation-form"
import { createClient } from "@/lib/supabase/server"

export default async function CreateInvitationPage() {
  const supabase = await createClient()

  const { data: templates } = await supabase.from("templates").select("*").eq("is_active", true).order("name")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">Buat Undangan Baru</h1>
        <p className="text-muted-foreground">Pilih template dan isi detail pernikahan Anda</p>
      </div>

      <CreateInvitationForm templates={templates || []} />
    </div>
  )
}
