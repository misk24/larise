"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface InvitationCoupleProps {
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
}

export function InvitationCouple({ groomName, brideName, groomParents, brideParents }: InvitationCoupleProps) {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground italic text-lg mb-4">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu
            sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
          </p>
          <p className="text-muted-foreground font-medium">QS. Ar-Rum: 21</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 bg-secondary">
              <Image
                src="/elegant-groom-portrait.jpg"
                alt={groomName}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-foreground mb-2">{groomName}</h3>
            <p className="text-muted-foreground">{groomParents}</p>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 bg-secondary">
              <Image
                src="/elegant-bride-portrait.jpg"
                alt={brideName}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-foreground mb-2">{brideName}</h3>
            <p className="text-muted-foreground">{brideParents}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
