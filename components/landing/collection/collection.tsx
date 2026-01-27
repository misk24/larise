"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion, stagger } from "framer-motion"
import Image from "next/image"
import { themes, themeSection } from "./constant"

export function ThemeSection() {
  return (
    <section id="collections" className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16"
        >
          {themeSection.title}
        </motion.h2>

        <motion.div 
          initial="hidden"
          whileInView="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: stagger(0.4)
              }
            }
          }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 1.2,
                    ease: "easeOut",
                  }
                }
              }}
            >
              <Card className="group overflow-hidden p-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="relative aspect-square overflow-hidden">
                  <Image
                    src="/images/logo-light.svg"
                    alt={theme.name}
                    fill
                    sizes="200"
                    loading="eager"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {theme.popular && (
                    <Badge className="absolute top-3 right-3">Populer</Badge>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <span className="text-small text-muted-foreground uppercase tracking-widest mb-1">{theme.category}</span>
                  <h3>{theme.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
