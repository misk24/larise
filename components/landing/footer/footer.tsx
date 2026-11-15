import { FadeIn } from "@/components/motion";
import { BrandLogo } from "@/components/landing/ui/brand-logo";
import { Container } from "@/components/landing/ui/container";
import { LandingScrollLink } from "@/components/landing/ui/smooth-scroll-link";
import { contacts } from "@/config/contact";
import { navigation } from "@/config/landing-navigation";
import { ArrowUpRight, AtSign, Mail, MapPinIcon, MessageCircle, type LucideIcon } from "lucide-react";
import Link from "next/link";

// Local outline icons instead of runtime-fetched brand icons: matches the minimal editorial style.
const contactIcons: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  gmail: Mail,
  instagram: AtSign,
};

export function Footer() {
  return (
    <footer className="bg-ink pb-7 pt-12 text-ivory sm:pt-16">
      <FadeIn>
        <Container>
          <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.2fr_0.7fr_0.8fr] md:gap-12 md:pb-14">
            <div className="max-w-sm">
              <LandingScrollLink href="/" aria-label="LARISÉ, kembali ke atas"><BrandLogo variant="footer" width={160} height={54} className="h-7" /></LandingScrollLink>
              <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">Undangan digital yang personal, untuk cerita dan hari yang berarti.</p>
              <Link href="/register" className="mt-6 inline-flex items-center gap-2 text-sm text-gold-soft transition-colors hover:text-white">Mulai buat undangan <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div>
              <h3 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-gold-soft">Jelajahi</h3>
              <ul className="space-y-3">
                {navigation.map((item) => <li key={item.href}><LandingScrollLink href={item.href} className="text-sm text-white/65 transition-colors hover:text-white">{item.label}</LandingScrollLink></li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-gold-soft">Terhubung</h3>
              <ul className="space-y-3">
                {contacts.map((contact) => {
                  const ContactIcon = contactIcons[contact.icon] ?? ArrowUpRight;
                  return (
                    <li key={contact.label}>
                      <a href={contact.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                        <ContactIcon className="size-3.5" aria-hidden="true" />
                        <span>{contact.label}</span>
                        <ArrowUpRight className="size-3 opacity-50" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
                <li className="inline-flex items-center gap-2 text-sm text-white/65"><MapPinIcon className="size-4 text-gold-soft" aria-hidden="true" /><span>Lombok Timur, NTB</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[11px] uppercase tracking-[0.14em] text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <span>© {new Date().getFullYear()} LARISÉ. Dibuat dengan perhatian.</span><span>Undangan digital, sentuhan personal.</span>
          </div>
        </Container>
      </FadeIn>
    </footer>
  );
}
