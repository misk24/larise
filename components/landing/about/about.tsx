import { useGsapRevealUp, useGsapSplitText } from "@/hooks/use-gsap";
import { ABOUT_SECTION } from "./constant";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const scope = useRef<HTMLDivElement>(null);
  // useGsapRevealUp(scope, ".data-reveal");
  useGsapSplitText(scope);

  return (
    <section className="px-6 py-32">
      <div
        // ref={scope}
        className="max-w-xl lg:max-w-4xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <h2 ref={scope} className="text-3xl">
            {ABOUT_SECTION.title}
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            {ABOUT_SECTION.description}
          </p>
        </div>
      </div>
    </section>
  );
}
