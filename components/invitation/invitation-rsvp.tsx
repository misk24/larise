"use client";

import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle, Loader2, MessageSquareHeart, Send, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import type { Wish } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface InvitationRsvpProps {
  invitationId: string;
  guestName: string;
  guestToken: string | null;
  wishes: Wish[];
  onWishAdded?: (wish: Wish) => void;
}

export function InvitationRsvp({ invitationId, guestName, guestToken, wishes, onWishAdded }: InvitationRsvpProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    status: "attending",
    guestCount: "1",
    message: "",
  });
  const supabase = createClient();
  const hasValidGuest = Boolean(guestToken && guestName !== "Tamu Undangan");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guestToken || !hasValidGuest) {
      toast.error("Gunakan tautan undangan pribadi untuk mengirim RSVP.");
      return;
    }
    setIsLoading(true);

    try {
      const attendeeCount = formData.status === "attending" ? Number.parseInt(formData.guestCount, 10) : 0;
      if (formData.status === "attending" && (!Number.isInteger(attendeeCount) || attendeeCount < 1 || attendeeCount > 10)) {
        throw new Error("Jumlah tamu harus antara 1 sampai 10.");
      }

      const { error: rsvpError } = await supabase.rpc("submit_guest_rsvp", {
        p_invitation_id: invitationId,
        p_guest_token: guestToken,
        p_status: formData.status,
        p_attendee_count: attendeeCount,
      });
      if (rsvpError) throw rsvpError;

      if (formData.message.trim()) {
        const { data: newWish, error: wishError } = await supabase.rpc("submit_guest_wish", {
          p_invitation_id: invitationId,
          p_guest_token: guestToken,
          p_message: formData.message.trim(),
        });
        if (wishError) throw wishError;
        if (newWish) onWishAdded?.(newWish as Wish);
      }

      setIsSubmitted(true);
      toast.success("Konfirmasi dan ucapan berhasil dikirim!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-2xl px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-serif font-semibold text-foreground md:text-4xl">RSVP & Ucapan</h2>
          <p className="text-muted-foreground">Konfirmasikan kehadiran dan kirimkan doa terbaik untuk kedua mempelai.</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <Card className="border-border/50">
            <CardContent className="p-6 md:p-8">
              {isSubmitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-chart-3/20">
                    <Check className="size-8 text-chart-3" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Terima kasih, {guestName}!</h3>
                  <p className="text-muted-foreground">Konfirmasi kehadiran dan ucapan Anda sudah kami terima.</p>
                </div>
              ) : (
                <>
                  {!hasValidGuest ? (
                    <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                      Untuk mengirim konfirmasi kehadiran dan ucapan, buka undangan melalui tautan pribadi yang dibagikan kepada Anda.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor={`rsvp-name-${invitationId}`}>Nama</Label>
                        <Input id={`rsvp-name-${invitationId}`} value={guestName} readOnly disabled aria-readonly="true" />
                      </div>

                      <div className="space-y-3">
                        <Label>Kehadiran</Label>
                        <RadioGroup value={formData.status} onValueChange={(value) => setFormData((prev) => ({
                          ...prev, status: value, guestCount: value === "attending" ? (prev.guestCount === "0" ? "1" : prev.guestCount) : "0",
                        }))} className="grid grid-cols-2 gap-3">
                          <Label htmlFor={`attending-${invitationId}`} className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${formData.status === "attending" ? "border-chart-3 bg-chart-3/10" : "border-border hover:border-chart-3/50"}`}>
                            <RadioGroupItem value="attending" id={`attending-${invitationId}`} className="sr-only" />
                            <UserCheck className="size-6 text-chart-3" /><span className="text-sm font-medium">Hadir</span>
                          </Label>
                          <Label htmlFor={`not-attending-${invitationId}`} className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${formData.status === "not_attending" ? "border-destructive bg-destructive/10" : "border-border hover:border-destructive/50"}`}>
                            <RadioGroupItem value="not_attending" id={`not-attending-${invitationId}`} className="sr-only" />
                            <UserX className="size-6 text-destructive" /><span className="text-sm font-medium">Tidak hadir</span>
                          </Label>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`rsvp-count-${invitationId}`}>Jumlah tamu</Label>
                        <Input id={`rsvp-count-${invitationId}`} type="number" min={formData.status === "attending" ? 1 : 0} max="10"
                          value={formData.status === "attending" ? formData.guestCount : "0"} disabled={formData.status !== "attending"}
                          onChange={(event) => setFormData((prev) => ({ ...prev, guestCount: event.target.value }))} required />
                        <p className="text-xs text-muted-foreground">Termasuk Anda, maksimal 10 orang. Jika tidak hadir, jumlah tamu menjadi 0.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`rsvp-message-${invitationId}`}>Ucapan & doa <span className="font-normal text-muted-foreground">(opsional)</span></Label>
                        <Textarea id={`rsvp-message-${invitationId}`} value={formData.message}
                          onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                          placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..." rows={4} maxLength={1000} />
                      </div>

                      <Button type="submit" className="section-design-button w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}Kirim
                      </Button>
                    </form>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-10 space-y-4">
          <div className="text-center">
            <MessageSquareHeart className="mx-auto mb-2 size-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Ucapan & doa</h3>
            <p className="text-sm text-muted-foreground">Pesan hangat dari keluarga dan teman.</p>
          </div>
          {wishes.length ? wishes.map((wish) => (
            <Card key={wish.id} className="border-border/50"><CardContent className="p-4">
              <p className="mb-3 italic text-foreground">&ldquo;{wish.message}&rdquo;</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{wish.guest_name}</p>
                <p className="text-xs text-muted-foreground">{new Date(wish.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
              </div>
            </CardContent></Card>
          )) : <div className="py-6 text-center text-sm text-muted-foreground"><HelpCircle className="mx-auto mb-2 size-5" />Belum ada ucapan. Jadilah yang pertama!</div>}
        </div>
      </div>
    </section>
  );
}
