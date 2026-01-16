import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Rini & Andi",
    location: "Jakarta",
    image: "/happy-indonesian-couple-wedding-portrait.jpg",
    content:
      "Undangan digitalnya sangat cantik dan mudah digunakan. Tamu-tamu kami sangat terkesan dengan desainnya yang elegan.",
    rating: 5,
  },
  {
    name: "Maya & Dimas",
    location: "Bandung",
    image: "/smiling-asian-couple-wedding-photo.jpg",
    content:
      "Fitur RSVP-nya sangat membantu kami dalam menghitung jumlah tamu. Customer service-nya juga sangat responsif!",
    rating: 5,
  },
  {
    name: "Sarah & Rizky",
    location: "Surabaya",
    image: "/happy-couple-wedding-celebration-portrait.jpg",
    content:
      "Harga terjangkau dengan fitur yang lengkap. Galeri foto dan musik latarnya membuat undangan jadi lebih personal.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimoni" className="py-20 md:py-32">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4 text-balance">
            Cerita Bahagia Mereka
          </h2>
          <p className="text-muted-foreground text-lg">
            Dengarkan pengalaman pasangan yang telah menggunakan layanan kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
