import { Container } from "@/components/landing/ui/container";
import { landingButtonStyles } from "@/components/landing/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="bg-gold-soft py-24 text-ink sm:py-32 lg:py-40">
      <Container className="grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
        <h2 id="cta-title" className="frontend-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[-0.06em] text-balance">
          Cerita kalian layak dirayakan.
        </h2>
        <div>
          <p className="max-w-sm text-base leading-7 sm:text-lg sm:leading-8">
            Mulai susun undangan yang personal, lalu bagikan kabar bahagia kepada orang-orang terdekat.
          </p>
          <Link href="/register" className={landingButtonStyles({ size: "lg", className: "mt-8 border-ink bg-ink text-ivory hover:border-ink-hover hover:bg-ink-hover" })}>Mulai Buat Undangan</Link>
          <p className="mt-4 text-sm text-ink/80">Mulai dengan memilih tema yang paling cocok untuk kalian.</p>
        </div>
      </Container>
    </section>
  );
}
