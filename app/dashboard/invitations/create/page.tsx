import { CreateInvitationForm } from "@/components/dashboard/create-invitation-form"
import { createClient } from "@/lib/supabase/server"

export default async function CreateInvitationPage() {
  const supabase = await createClient()
  const { data: themes } = await supabase.from("themes").select("*").eq("is_active", true).order("name")

  return (
    <div className="space-y-6">
      <div>
        <span className="text-2xl md:text-3xl font-medium">Buat Undangan Baru</span>
        <p className="text-muted-foreground">Pilih tema dan isi detail pernikahan Anda</p>
      </div>

      <CreateInvitationForm themes={themes || []} />
    </div>
  )
}
