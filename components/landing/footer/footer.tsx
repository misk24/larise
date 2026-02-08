"use client";

import { navLinks } from "@/components/landing/shared";
import { Logo } from "@/components/logo";
import { FadeIn } from "@/components/motion";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Icon } from "@iconify/react";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { footerSection } from "./constant";

export function Footer() {
  const handleSmoothScroll = useSmoothScroll();

  return (
    <footer className="bg-foreground text-background px-6 pt-16 pb-8 md:px-8">
      <FadeIn className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <Link href="/" onClick={(e) => handleSmoothScroll(e, "/")}>
              <Logo variant="footer" />
            </Link>
          </div>

          <div>
            <h4 className="mb-4">Links</h4>
            <ul className="space-y-4 opacity-90">
              {navLinks.map((link, index) => (
                <li key={index} className="hover:text-accent transition-colors">
                  <Link href={link.href}>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="size-4" />
                      <span className="text-sm">{link.label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Contacts</h4>
            <ul className="space-y-4 opacity-90">
              {footerSection.socials.map((social, index) => (
                <li key={index} className="hover:text-accent transition-colors">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={`simple-icons:${social.icon}`}
                        className="size-3.5"
                      />
                      <span className="text-sm">{social.label}</span>
                    </div>
                  </a>
                </li>
              ))}

              <li>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="text-sm">{footerSection.location}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center opacity-90">
          <span className="text-sm">
            &copy; {new Date().getFullYear()} {footerSection.copy}
          </span>
        </div>
      </FadeIn>
    </footer>
  );
}
