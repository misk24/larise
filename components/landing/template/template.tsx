import { useGsapParallax, useGsapRevealUp } from "@/hooks/use-gsap";
import { TEMPLATE_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TemplateSection() {
  const templateRef = useRef<HTMLDivElement>(null);
  // useGsapRevealUp(templateRef);
  useGsapParallax(templateRef, "[data-template-item]");

  return (
    <section 
      id="template" 
      className="px-6 py-32"
    >
      <div 
        ref={templateRef}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl mb-16">
          {TEMPLATE_SECTION.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              data-template-item
              key={i}
              className="aspect-3/4 rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    </section>
  )
}