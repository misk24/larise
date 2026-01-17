import gsap from "gsap";
import { ABOUT_SECTION } from "./constant";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useGsapRevealUp } from "@/hooks/use-gsap";

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const aboutRef = useRef<HTMLDivElement>(null);
  // const contentRef = useRef<HTMLDivElement>(null);
  useGsapRevealUp(aboutRef);

  // useEffect(() => {
  //   const element = contentRef.current;
  //   if (element) {
  //     gsap.fromTo(element.children,
  //       { autoAlpha: 0, y: 24 },
  //       {
  //         autoAlpha: 1,
  //         y: 0,
  //         duration: 1,
  //         stagger: 0.4,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: aboutRef.current,
  //           start: "center 60%",
  //           end: "center 20%",
  //           toggleActions: "play none reverse none",
  //         }
  //       }
  //     );
  //   }
  // }, [])

  return (
    <section className="px-6 py-32">
      <div className="max-w-xl lg:max-w-4xl mx-auto">
        <div ref={aboutRef} className="grid md:grid-cols-2 gap-12">
          <h2 className="text-3xl">
            {ABOUT_SECTION.title}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {ABOUT_SECTION.description}
          </p>
        </div>
      </div>
    </section>
  );
}
