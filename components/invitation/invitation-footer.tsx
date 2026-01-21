"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface InvitationFooterProps {
  groomName: string
  brideName: string
  eventDate: string
}

export function InvitationFooter({ groomName, brideName, eventDate }: InvitationFooterProps) {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container px-6 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <p className="text-background/70 mb-4">Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir</p>
          <p className="text-background/70 mb-8">untuk memberikan doa restu kepada kedua mempelai.</p>

          <div className="mb-8">
            <p className="text-background/80 text-sm uppercase tracking-[0.2em] mb-2">Hormat Kami,</p>
            <h3 className="text-2xl font-serif font-semibold">
              {groomName} & {brideName}
            </h3>
          </div>

          <Heart className="h-8 w-8 mx-auto text-background/50 fill-background/50 mb-8" />

          <div className="border-t border-background/20 pt-8">
            <p className="text-background/50 text-sm">
              Made with love by{" "}
              <a href="/" className="text-background/70 hover:text-background transition-colors">
                Nikahku
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
