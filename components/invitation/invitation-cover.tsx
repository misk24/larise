"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Heart, Mail } from "lucide-react"

interface InvitationCoverProps {
  groomName: string
  brideName: string
  eventDate: string
  guestName: string
  onOpen: () => void
}

export function InvitationCover({ groomName, brideName, eventDate, guestName, onOpen }: InvitationCoverProps) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-background/80 text-sm uppercase tracking-[0.3em] mb-4">Undangan Pernikahan</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-background mb-2">{groomName}</h1>
          <div className="flex items-center justify-center gap-4 my-4">
            <div className="h-px w-16 bg-background/50" />
            <Heart className="h-6 w-6 text-background fill-background" />
            <div className="h-px w-16 bg-background/50" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-background">{brideName}</h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-background/90 mb-8"
        >
          {formattedDate}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-background/10 backdrop-blur-sm rounded-lg p-6 mb-8"
        >
          <p className="text-background/80 text-sm mb-2">Kepada Yth.</p>
          <p className="text-background text-xl font-serif font-medium">{guestName}</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
          <Button
            onClick={onOpen}
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 gap-2 px-8"
          >
            <Mail className="h-4 w-4" />
            Buka Undangan
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
