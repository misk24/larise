import { useGsapParallax, useGsapRevealUp } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TemplateSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(sectionRef);
  useGsapParallax(sectionRef, "[data-template-item]");

  return (
    <section ref={sectionRef} id="template" className="max-w-6xl mx-auto px-6 py-32">
      <h2 className="text-3xl mb-16">Template Pilihan</h2>
      <div className="grid md:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            data-template-item
            className="aspect-3/4 rounded-3xl bg-muted"
          />
        ))}
      </div>
    </section>
  )
}