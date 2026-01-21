import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Basic",
    price: "Rp 99.000",
    description: "Untuk pasangan yang ingin undangan sederhana",
    features: [
      "1 Template Pilihan",
      "Kelola hingga 100 Tamu",
      "RSVP Online",
      "Galeri 10 Foto",
      "Countdown Timer",
      "Aktif 30 Hari",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "Rp 199.000",
    description: "Pilihan terbaik untuk undangan lengkap",
    features: [
      "Semua Template Premium",
      "Kelola hingga 500 Tamu",
      "RSVP Online",
      "Galeri 50 Foto",
      "Countdown Timer",
      "Musik Latar",
      "Ucapan & Doa",
      "Amplop Digital",
      "Aktif 90 Hari",
    ],
    popular: true,
  },
  {
    name: "Exclusive",
    price: "Rp 399.000",
    description: "Untuk pengalaman undangan terbaik",
    features: [
      "Semua Fitur Premium",
      "Tamu Unlimited",
      "Galeri Unlimited",
      "Custom Domain",
      "Prioritas Support",
      "Aktif 1 Tahun",
      "Desain Kustom",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4 text-balance">
            Pilih Paket yang Sesuai
          </h2>
          <p className="text-muted-foreground text-lg">
            Harga terjangkau dengan fitur lengkap untuk hari spesial Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-card border-border/50 ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Paling Populer
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-serif font-bold text-foreground">
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">Pilih Paket</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
