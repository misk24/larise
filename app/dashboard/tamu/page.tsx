import { GuestManager } from "@/components/dashboard/guest-manager"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function GuestsPage() {
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) redirect("/login")

  // Get user's invitation
  // const { data: invitation } = await supabase.from("invitations").select("id").eq("user_id", user.id).single()

  // if (!invitation) {
  //   return (
  //     <div className="space-y-6">
  //       <div>
  //         <h1 className="text-2xl md:text-3xl font-serif font-semibold">Daftar Tamu</h1>
  //         <p className="text-muted-foreground">Kelola daftar tamu undangan Anda</p>
  //       </div>
  //       <Card className="border-border/50">
  //         <CardContent className="p-12 text-center">
  //           <p className="text-muted-foreground">Buat undangan terlebih dahulu untuk mengelola daftar tamu.</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  // Get guests with RSVP status
  // const { data: guests } = await supabase
  //   .from("guests")
  //   .select("*, rsvp(*)")
  //   .eq("invitation_id", invitation.id)
  //   .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">Daftar Tamu</h1>
        <p className="text-muted-foreground">Kelola daftar tamu undangan Anda</p>
      </div>

      <GuestManager  />
      {/* <GuestManager invitationId={invitation.id} initialGuests={guests || []} /> */}
    </div>
  )
}
