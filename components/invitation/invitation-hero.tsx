"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface InvitationHeroProps {
  groomName: string
  brideName: string
  eventDate: string
}

export function InvitationHero({ groomName, brideName, eventDate }: InvitationHeroProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date(eventDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [eventDate])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 text-center px-6 py-20">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground uppercase tracking-[0.3em] text-sm mb-6"
        >
          The Wedding Of
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-foreground mb-2">{groomName}</h1>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-20 bg-primary/50" />
            <Heart className="h-8 w-8 text-primary fill-primary animate-float" />
            <div className="h-px w-20 bg-primary/50" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-foreground">{brideName}</h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mt-8 mb-12"
        >
          {new Date(eventDate).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-4 gap-4 max-w-md mx-auto"
        >
          {[
            { value: countdown.days, label: "Hari" },
            { value: countdown.hours, label: "Jam" },
            { value: countdown.minutes, label: "Menit" },
            { value: countdown.seconds, label: "Detik" },
          ].map((item, index) => (
            <div key={index} className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <p className="text-3xl md:text-4xl font-serif font-semibold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
