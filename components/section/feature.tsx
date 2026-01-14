import { useGsapRevealUp, useGsapScrollStagger } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useGsapRevealUp(sectionRef);
  useGsapScrollStagger(sectionRef, "[data-feature-card]");

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-muted">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl mb-16">Fitur Utama</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Custom Nama Tamu", "Edit Fleksibel", "Desain Premium"].map((item) => (
            <div
              key={item}
              data-feature-card
              className="rounded-2xl bg-background p-8"
            >
              <h3 className="font-medium">{item}</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Fokus pada pengalaman visual dan kemudahan penggunaan.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}