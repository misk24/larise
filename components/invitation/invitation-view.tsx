"use client"

import type { Invitation, Theme, Wish } from "@/types/database"
import { useEffect, useRef, useState } from "react"
import { InvitationHero } from "./invitation-hero"
import { InvitationCouple } from "./invitation.couple"
import { InvitationEvent } from "./invitation-event"
import { InvitationGallery } from "./invitation-gallery"
import { InvitationRsvp } from "./invitation-rsvp"
import { InvitationWishes } from "./invitation-wishes"
import { InvitationGift } from "./invitation-gift"
import { InvitationFooter } from "./invitation-footer"

interface InvitationViewProps {
  invitation: Invitation & { themes?: Theme | null }
  guestName: string
  wishes: Wish[]
}

function parentLabel(father: string | null, mother: string | null) {
  return [father, mother].filter(Boolean).join(" & ")
}

export function InvitationView({ invitation, guestName, wishes: initialWishes }: InvitationViewProps) {
  const [wishes, setWishes] = useState(initialWishes)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (invitation.background_music_url) {
      audioRef.current?.play().catch(() => undefined)
    }
  }, [invitation.background_music_url])

  const eventDate = invitation.resepsi_date || invitation.akad_date || ""
  const gallery = invitation.gallery_photos || []
  const bank = invitation.bank_accounts?.[0]

  return (
    <main className="min-h-screen bg-background">
      {invitation.background_music_url && (
        <audio ref={audioRef} src={invitation.background_music_url} loop />
      )}

      <InvitationHero
        groomName={invitation.groom_name}
        brideName={invitation.bride_name}
        eventDate={eventDate}
      />

      <InvitationCouple
        groomName={invitation.groom_name}
        brideName={invitation.bride_name}
        groomParents={parentLabel(invitation.groom_father, invitation.groom_mother)}
        brideParents={parentLabel(invitation.bride_father, invitation.bride_mother)}
      />

      {(invitation.akad_location || invitation.resepsi_location) && (
        <InvitationEvent
          eventDate={eventDate}
          akadTime={invitation.akad_time || ""}
          eventTime={invitation.resepsi_time || ""}
          akadVenue={invitation.akad_location || ""}
          akadAddress={invitation.akad_address || ""}
          venueName={invitation.resepsi_location || ""}
          venueAddress={invitation.resepsi_address || ""}
        />
      )}

      {invitation.love_story && (
        <section className="py-20 md:py-32">
          <div className="container px-6 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">Kisah Kami</h2>
            <p className="whitespace-pre-line text-muted-foreground leading-8">{invitation.love_story}</p>
          </div>
        </section>
      )}

      {invitation.show_gallery && gallery.length > 0 && <InvitationGallery images={gallery} />}

      {invitation.show_rsvp && (
        <InvitationRsvp invitationId={invitation.id} guestName={guestName} />
      )}

      {invitation.show_rsvp && (
        <InvitationWishes
          invitationId={invitation.id}
          wishes={wishes}
          onWishAdded={(wish) => setWishes((prev) => [wish, ...prev])}
        />
      )}

      {invitation.show_gift && bank && (
        <InvitationGift
          bankName={bank.bank}
          bankAccount={bank.account_number}
          bankHolder={bank.account_name}
        />
      )}

      <InvitationFooter
        groomName={invitation.groom_name}
        brideName={invitation.bride_name}
        eventDate={eventDate}
      />
    </main>
  )
}
