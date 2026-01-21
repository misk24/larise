"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

interface InvitationEventProps {
  eventDate: string
  akadTime: string
  eventTime: string
  akadVenue: string
  akadAddress: string
  venueName: string
  venueAddress: string
}

export function InvitationEvent({
  eventDate,
  akadTime,
  eventTime,
  akadVenue,
  akadAddress,
  venueName,
  venueAddress,
}: InvitationEventProps) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <section className="py-20 md:py-32">
      <div className="container px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">Waktu & Tempat</h2>
          <p className="text-muted-foreground">Dengan memohon rahmat dan ridho Allah SWT</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {akadVenue && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Akad Nikah</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{akadTime} WIB</span>
                    </div>
                    <div className="flex items-start justify-center gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{akadVenue}</p>
                        <p className="text-sm">{akadAddress}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-6 bg-transparent" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(akadAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Lihat Lokasi
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {venueName && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Resepsi</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{eventTime} WIB - Selesai</span>
                    </div>
                    <div className="flex items-start justify-center gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{venueName}</p>
                        <p className="text-sm">{venueAddress}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-6 bg-transparent" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Lihat Lokasi
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Button asChild>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan&dates=${eventDate?.replace(/-/g, "")}/${eventDate?.replace(/-/g, "")}&details=Undangan Pernikahan&location=${encodeURIComponent(venueAddress || akadAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Simpan ke Kalender
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
