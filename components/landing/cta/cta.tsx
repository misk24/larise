import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/use-gsap";
import { CTA_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// export default function CtaSection() {
//   const ctaRef = useRef<HTMLDivElement>(null)
//   useGsapReveal(ctaRef);

//   return (
//     <section className="px-6">
//       <div
//         ref={ctaRef}
//         className="px-6 py-32 bg-foreground text-background text-center rounded-2xl"
//       >
//         <h2 className="text-4xl">
//           {CTA_SECTION.title}
//         </h2>

//         <p className="mt-6 text-background/80">
//           {CTA_SECTION.description}
//         </p>
//         <Link href={CTA_SECTION.cta.href}>
//           <Button size="lg" variant="secondary" className="mt-10 rounded-full cursor-pointer">
//             {CTA_SECTION.cta.label}
//           </Button>
//         </Link>
//       </div>
//     </section>
//   )
// }

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="h-12 w-12 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-balance">
            Siap Membuat Undangan Impian Anda?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ratusan pasangan yang telah mempercayakan momen
            spesial mereka kepada kami
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-base px-8"
          >
            <Link href="/register">
              Mulai Buat Undangan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
