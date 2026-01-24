"use client"

import { motion } from "framer-motion"
import { stats } from "./constant"

export function StatSection() {
  return (
    <section className="px-6 pb-32">
      <div className="max-w-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="grid grid-cols-3 gap-12"
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
            >
              <h3 className="mb-2">
                {stat.value}
              </h3>
              
              <p className="text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
