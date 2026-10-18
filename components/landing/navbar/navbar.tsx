"use client";

import { BrandLogo } from "@/components/landing/ui/brand-logo";
import { LandingButton, landingButtonStyles } from "@/components/landing/ui/button";
import { LandingScrollLink } from "@/components/landing/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { useScroll } from "@/hooks/use-scroll";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { MobileHeader } from "./mobile-navbar";

export const navigation = [
  { label: "Tema", href: "#collections" },
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const isScrolled = useScroll();
  const isOpen = useOverlay();

  return (
    <header className={["fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", isScrolled ? "border-[#29271F]/10 bg-[#F8F6F1]/95 shadow-[0_8px_30px_-24px_rgba(41,39,31,0.3)] backdrop-blur-xl" : "border-transparent bg-[#F8F6F1]/75 backdrop-blur-md"].join(" ")}>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <LandingScrollLink href="/" aria-label="LARISÉ, kembali ke atas" className="shrink-0">
          <BrandLogo width={150} height={50} className="h-6 sm:h-7" />
        </LandingScrollLink>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-9">
            {navigation.map((item) => (
              <li key={item.href} className="text-xs tracking-wide text-[#29271F]/65 transition-colors hover:text-[#927653] lg:text-sm">
                <LandingScrollLink href={item.href}>{item.label}</LandingScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          <Link href="/login" className={landingButtonStyles({ variant: "text", size: "sm" })}>Masuk</Link>
          <Link href="/register" className={landingButtonStyles({ size: "sm", className: "px-4 lg:px-5" })}>Buat Undangan</Link>
        </div>

        <LandingButton
          variant="icon"
          size="icon"
          onClick={isOpen.toggle}
          className="relative md:hidden"
          aria-expanded={isOpen.isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen.isOpen ? "Tutup menu" : "Buka menu"}
        >
          <MenuIcon
            aria-hidden="true"
            className={[
              "absolute size-4 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isOpen.isOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
            ].join(" ")}
          />
          <XIcon
            aria-hidden="true"
            className={[
              "absolute size-4 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isOpen.isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
            ].join(" ")}
          />
        </LandingButton>
      </div>
      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}
