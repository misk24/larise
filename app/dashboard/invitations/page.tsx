import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Edit, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"

export default async function UndanganPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, templates(name, category)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-2xl md:text-3xl font-heading">Undangan Saya</span>
          <p className="text-muted-foreground">Kelola semua undangan pernikahan Anda</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invitations/create">
            <Plus className="mr-2 h-4 w-4" />
            Buat Undangan
          </Link>
        </Button>
      </div>

      {invitations && invitations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="border-border/50 overflow-hidden">
              <div className="aspect-4/3 bg-secondary/50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-lg font-serif">{invitation.groom_name || "Nama Pria"}</p>
                    <p className="text-muted-foreground">&</p>
                    <p className="text-lg font-serif">{invitation.bride_name || "Nama Wanita"}</p>
                  </div>
                </div>
                <Badge
                  className={`absolute top-3 right-3 ${
                    invitation.is_published ? "bg-chart-3 text-chart-3-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {invitation.is_published ? "Dipublikasi" : "Draft"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Template: {invitation.templates?.name || "Belum dipilih"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tanggal:{" "}
                    {invitation.event_date
                      ? new Date(invitation.event_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Belum diatur"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/dashboard/undangan/${invitation.id}`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  {invitation.is_published && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/undangan/${invitation.slug}`} target="_blank">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Plus className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Undangan</h3>
            <p className="text-muted-foreground mb-6">Buat undangan pernikahan digital pertama Anda</p>
            <Button asChild>
              <Link href="/dashboard/invitations/create">
                <Plus className="mr-2 h-4 w-4" />
                Buat Undangan
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
