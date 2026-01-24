"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useGsapParallax, useGsapRevealUp } from "@/hooks/use-gsap"
import { motion, stagger } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { themes, themeSection } from "./constant"

export function ThemeSection() {
  return (
    <section 
      id="collections" 
      className="px-6 py-32"
    >
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
                    src="/images/larisé.svg"
                    alt={theme.name}
                    fill
                    sizes="200"
                    loading="eager"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {theme.popular && (
                    <Badge className="absolute top-3 right-3">
                      Populer
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <span className="text-small text-muted-foreground uppercase tracking-widest mb-1">
                    {theme.category}
                  </span>
                  <h3>
                    {theme.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            asChild
          >
            <Link href="/register">
              Lihat Semua Thema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div> */}
      </div>
    </section>
  )
}
