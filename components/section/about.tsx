import { useGsapRevealUp } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGsapRevealUp(sectionRef);

  return (
    <section ref={sectionRef} className="py-32 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
      <h2 className="text-3xl">Tentang LARISÉ</h2>
      <p className="text-muted-foreground leading-relaxed">
        LARISÉ menghadirkan undangan digital dengan pendekatan editorial, bukan template massal.
      </p>
    </section>
  )
}