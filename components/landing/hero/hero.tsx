"use client"

import { Button } from "@/components/ui/button"
import { motion, stagger } from "framer-motion"
import Link from "next/link"
import { heroSection } from "./constant"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/romantic-wedding-flowers-soft-pink-petals-elegant-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
      </motion.div>

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <motion.div 
          initial="hidden"
          whileInView="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: stagger(0.6)
              }
            }
          }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1 
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
            className="mb-8 text-balance"
          >
            {heroSection.title}
          </motion.h1>

          <motion.p 
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
            className="text-muted-foreground tracking-[0.3em] uppercase mb-12"
          >
            {heroSection.sub}
          </motion.p>

          <motion.div 
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
            className="max-w-xs mx-auto grid grid-cols-2 items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="rounded-full"
              asChild
            >
              <Link href={heroSection.cta.primary.href}>
                {heroSection.cta.primary.label}
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-background hover:border-accent hover:text-primary-foreground rounded-full"
              asChild
            >
              <Link href={heroSection.cta.secondary.href}>
                {heroSection.cta.secondary.label}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
