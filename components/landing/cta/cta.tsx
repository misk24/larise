import { Item, Stagger } from "@/components/motion";
import { Container } from "@/components/landing/ui/container";
import { Eyebrow } from "@/components/landing/ui/eyebrow";
import { landingButtonStyles } from "@/components/landing/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="bg-background py-20 sm:py-28 lg:py-36">
      <Container className="max-w-4xl text-center">
        <Stagger>
          <Item><Eyebrow rule={false} className="justify-center">Mulai dari sini</Eyebrow></Item>
          <Item><h2 id="cta-title" className="frontend-display mx-auto max-w-3xl text-[clamp(3rem,8vw,6.5rem)] leading-[0.94] tracking-[-0.06em] text-balance">Cerita kalian layak <span className="text-gold-deep">dirayakan.</span></h2></Item>
          <Item><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">Mulai susun undangan yang personal, lalu bagikan kabar bahagia kepada orang-orang terdekat.</p></Item>
          <Item><Link href="/register" className={landingButtonStyles({ size: "lg", className: "mt-8 sm:mt-10" })}>Mulai Buat Undangan</Link></Item>
          <Item><p className="mt-5 text-xs text-muted-foreground">Mulai dengan memilih tema yang paling cocok untuk kalian.</p></Item>
        </Stagger>
      </Container>
    </section>
  );
}
