import { SettingsForm } from "@/components/dashboard/settings-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <span className="text-2xl md:text-3xl font-medium">Pengaturan Akun</span>
        <p className="text-muted-foreground">Kelola informasi akun Anda</p>
      </div>

      <SettingsForm user={user} profile={profile} />
    </div>
  )
}
