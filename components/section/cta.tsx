import { useGsapReveal } from "@/hooks/use-gsap";
import { Button } from "../ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGsapReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-32 px-6 text-center bg-foreground text-background">
      <div>
        <h2 className="text-4xl">Siap Membuat Undanganmu?</h2>
        <p className="mt-6 text-background/80">
          Pilih template, sesuaikan cerita, dan bagikan dengan elegan.
        </p>
        <Button size="lg" variant="secondary" className="mt-10 rounded-full">
          Pesan Sekarang
        </Button>
      </div>
    </section>
  )
}