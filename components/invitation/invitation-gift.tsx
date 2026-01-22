"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Building2, Check, Copy, Gift } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface InvitationGiftProps {
  bankName: string
  bankAccount: string
  bankHolder: string
}

export function InvitationGift({ bankName, bankAccount, bankHolder }: InvitationGiftProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(bankAccount)
    setCopied(true)
    toast.success("Nomor rekening disalin!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container px-6 max-w-xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">Amplop Digital</h2>
          <p className="text-muted-foreground">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan hadiah,
            kami menyediakan amplop digital.
          </p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <Card className="border-border/50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{bankName}</span>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-2xl font-mono font-semibold text-foreground tracking-wider">{bankAccount}</p>
                </div>

                <p className="text-muted-foreground">a.n. {bankHolder}</p>

                <Button onClick={handleCopy} variant="outline" className="bg-transparent">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-chart-3" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Salin Nomor Rekening
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
