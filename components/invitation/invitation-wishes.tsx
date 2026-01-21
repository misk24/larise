"use client"

import { createClient } from "@/lib/supabase/client"
import type { Wish } from "@/types/database"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2, MessageSquareHeart, Send } from "lucide-react"
import { Textarea } from "../ui/textarea"

interface InvitationWishesProps {
  invitationId: string
  wishes: Wish[]
  onWishAdded: (wish: Wish) => void
}

export function InvitationWishes({ invitationId, wishes, onWishAdded }: InvitationWishesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("wishes")
        .insert({
          invitation_id: invitationId,
          name: formData.name,
          message: formData.message,
        })
        .select()
        .single()

      if (error) throw error

      onWishAdded(data)
      setFormData({ name: "", message: "" })
      toast.success("Ucapan berhasil dikirim!")
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">Ucapan & Doa</h2>
          <p className="text-muted-foreground">Kirimkan ucapan dan doa terbaik untuk kedua mempelai</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wishName">Nama</Label>
                    <Input
                      id="wishName"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wishMessage">Ucapan & Doa</Label>
                    <Textarea
                      id="wishMessage"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tulis ucapan dan doa Anda..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Kirim Ucapan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <div className="h-100 overflow-y-auto space-y-4 pr-2">
              {wishes.length > 0 ? (
                wishes.map((wish, index) => (
                  <Card key={wish.id} className="border-border/50">
                    <CardContent className="p-4">
                      <p className="text-foreground mb-3 italic">&ldquo;{wish.message}&rdquo;</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{wish.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(wish.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquareHeart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Jadilah yang pertama mengirim ucapan!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
