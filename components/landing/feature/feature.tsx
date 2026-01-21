"use client"

import { motion, stagger } from "framer-motion"
import { featureSection } from "./constant"

export function FeatureSection() {
  return (
    <section 
      id="features" 
      className="px-6 py-32 bg-muted"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="mb-16"
        >
          {featureSection.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureSection.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.2, ease: "easeOut" }}
              className="rounded-2xl bg-background p-6"
            >
              <h3>
                {feature.title}
              </h3>

              <p className="mt-4 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
