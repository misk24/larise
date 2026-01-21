"use client"

import type { Invitation, Template, Wish } from "@/types/database"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { InvitationCover } from "./invitation-cover"
import { MusicPlayer } from "./music-player"
import { InvitationHero } from "./invitation-hero"
import { InvitationCouple } from "./invitation.couple"
import { InvitationEvent } from "./invitation-event"
import { InvitationGallery } from "./invitation-gallery"
import { InvitationRsvp } from "./invitation-rsvp"
import { InvitationWishes } from "./invitation-wishes"
import { InvitationGift } from "./invitation-gift"
import { InvitationFooter } from "./invitation-footer"

interface InvitationViewProps {
  invitation: Invitation & { templates: Template | null }
  guestName: string
  wishes: Wish[]
}

export function InvitationView({ invitation, guestName, wishes: initialWishes }: InvitationViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [wishes, setWishes] = useState(initialWishes)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      })
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const addWish = (newWish: Wish) => {
    setWishes((prev) => [newWish, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      <audio ref={audioRef} src="/wedding-music.mp3" loop />

      <AnimatePresence mode="wait">
        {/* {!isOpen ? (
          <InvitationCover
            key="cover"
            groomName={invitation.groom_name || ""}
            brideName={invitation.bride_name || ""}
            eventDate={invitation.event_date || ""}
            guestName={guestName}
            onOpen={handleOpen}
          />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <MusicPlayer audioRef={audioRef} />

            <InvitationHero
              groomName={invitation.groom_name || ""}
              brideName={invitation.bride_name || ""}
              eventDate={invitation.event_date || ""}
            />

            <InvitationCouple
              groomName={invitation.groom_name || ""}
              brideName={invitation.bride_name || ""}
              groomParents={invitation.groom_parents || ""}
              brideParents={invitation.bride_parents || ""}
            />

            <InvitationEvent
              eventDate={invitation.event_date || ""}
              akadTime={invitation.akad_time || ""}
              eventTime={invitation.event_time || ""}
              akadVenue={invitation.akad_venue || ""}
              akadAddress={invitation.akad_address || ""}
              venueName={invitation.venue_name || ""}
              venueAddress={invitation.venue_address || ""}
            />

            {invitation.gallery_images && invitation.gallery_images.length > 0 && (
              <InvitationGallery images={invitation.gallery_images} />
            )}

            <InvitationRsvp invitationId={invitation.id} guestName={guestName} />

            <InvitationWishes invitationId={invitation.id} wishes={wishes} onWishAdded={addWish} />

            {(invitation.bank_name || invitation.bank_account) && (
              <InvitationGift
                bankName={invitation.bank_name || ""}
                bankAccount={invitation.bank_account || ""}
                bankHolder={invitation.bank_holder || ""}
              />
            )}

            <InvitationFooter
              groomName={invitation.groom_name || ""}
              brideName={invitation.bride_name || ""}
              eventDate={invitation.event_date || ""}
            />
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  )
}
