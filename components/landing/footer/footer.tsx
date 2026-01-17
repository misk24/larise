import { LOGO } from "@/constants/logo";
import { navLinks } from "@/constants/navigation";
import { Heart, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { socialLinks } from "./constant";
import { Icon } from "@iconify/react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6 mb-8">
          <Link href="/">
            <span className="text-2xl font-heading tracking-widest">{LOGO}</span>
          </Link>

          <div className="flex gap-12">
            {socialLinks.map((social, index) => (
              <a
              key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-background transition-colors"
                aria-label={social.label}
              >
                <Icon icon={`simple-icons:${social.icon}`} className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="text-sm text-background/60">Lombok Timur, Nusa Tenggara Barat</p>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {LOGO}. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
