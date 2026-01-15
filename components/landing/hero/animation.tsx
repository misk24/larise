import gsap from "gsap";
import { useEffect, useRef } from "react"

export default function HeroBackground() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 2.5, ease: "power2.out" }
      )

      gsap.to(bgRef.current, {
        backgroundPosition: "100% 50%",
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 hero-gradient" />
  )
}