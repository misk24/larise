"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Check, HelpCircle, Loader2, UserCheck, UserX } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

interface InvitationRsvpProps {
  invitationId: string
  guestName: string
}

export function InvitationRsvp({ invitationId, guestName }: InvitationRsvpProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: guestName !== "Tamu Undangan" ? guestName : "",
    status: "attending",
    guestCount: "1",
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, find or create guest
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("id")
        .eq("invitation_id", invitationId)
        .eq("name", formData.name)
        .single()

      let guestId = existingGuest?.id

      if (!guestId) {
        const { data: newGuest, error: guestError } = await supabase
          .from("guests")
          .insert({
            invitation_id: invitationId,
            name: formData.name,
          })
          .select("id")
          .single()

        if (guestError) throw guestError
        guestId = newGuest.id
      }

      // Check if RSVP already exists
      const { data: existingRsvp } = await supabase.from("rsvp").select("id").eq("guest_id", guestId).single()

      if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from("rsvp")
          .update({
            status: formData.status,
            guest_count: Number.parseInt(formData.guestCount),
          })
          .eq("id", existingRsvp.id)

        if (error) throw error
      } else {
        // Create new RSVP
        const { error } = await supabase.from("rsvp").insert({
          invitation_id: invitationId,
          guest_id: guestId,
          status: formData.status,
          guest_count: Number.parseInt(formData.guestCount),
        })

        if (error) throw error
      }

      setIsSubmitted(true)
      toast.success("Konfirmasi kehadiran berhasil disimpan!")
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container px-6 max-w-xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">Konfirmasi Kehadiran</h2>
          <p className="text-muted-foreground">Mohon konfirmasi kehadiran Anda pada acara kami</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <Card className="border-border/50">
            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Terima Kasih!</h3>
                  <p className="text-muted-foreground">Konfirmasi kehadiran Anda telah tersimpan.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama Anda"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Konfirmasi Kehadiran</Label>
                    <RadioGroup
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                      className="grid grid-cols-3 gap-3"
                    >
                      <Label
                        htmlFor="attending"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.status === "attending"
                            ? "border-chart-3 bg-chart-3/10"
                            : "border-border hover:border-chart-3/50"
                        }`}
                      >
                        <RadioGroupItem value="attending" id="attending" className="sr-only" />
                        <UserCheck className="h-6 w-6 text-chart-3" />
                        <span className="text-sm font-medium">Hadir</span>
                      </Label>
                      <Label
                        htmlFor="not_attending"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.status === "not_attending"
                            ? "border-destructive bg-destructive/10"
                            : "border-border hover:border-destructive/50"
                        }`}
                      >
                        <RadioGroupItem value="not_attending" id="not_attending" className="sr-only" />
                        <UserX className="h-6 w-6 text-destructive" />
                        <span className="text-sm font-medium">Tidak Hadir</span>
                      </Label>
                      <Label
                        htmlFor="pending"
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.status === "pending"
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <RadioGroupItem value="pending" id="pending" className="sr-only" />
                        <HelpCircle className="h-6 w-6 text-accent" />
                        <span className="text-sm font-medium">Belum Pasti</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  {formData.status === "attending" && (
                    <div className="space-y-2">
                      <Label htmlFor="guestCount">Jumlah Tamu</Label>
                      <Input
                        id="guestCount"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.guestCount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: e.target.value }))}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kirim Konfirmasi
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
