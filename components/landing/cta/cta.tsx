"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, stagger } from "framer-motion"
import { ctaSection } from "./constant"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4">
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
          className="text-center"
        >
          <motion.h2 
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
            className="mb-4 text-balance"
          >
            {ctaSection.title}
          </motion.h2>

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
            className="opacity-90 mb-8 max-w-md mx-auto"
          >
            {ctaSection.description}
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
          >
            <Button
              size="lg"
              variant="secondary"
              className="px-6 rounded-full"
              asChild
            >
              <Link href={ctaSection.cta.href}>
                {ctaSection.cta.label}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
