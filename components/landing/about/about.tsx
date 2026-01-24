"use client"

import { motion } from "framer-motion"
import { aboutSection } from "./constant"

export function AboutSection() {
  return (
    <section className="px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {aboutSection.title}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-muted-foreground leading-relaxed"
          >
            {aboutSection.description}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
