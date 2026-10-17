"use client";

import { Scale } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
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
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", isScrolled ? "border-border/70 bg-background/90 shadow-[0_8px_30px_-24px_rgba(41,39,31,0.3)] backdrop-blur-xl" : "border-transparent bg-background/70 backdrop-blur-md")}>
      <Scale className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <SmoothScrollLink href="/" aria-label="LARISÉ, kembali ke atas" className="shrink-0"><Logo width={150} height={50} className="h-6 sm:h-7" /></SmoothScrollLink>
        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-9">
            {navigation.map((link) => <li key={link.href} className="text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground lg:text-sm"><SmoothScrollLink href={link.href}>{link.label}</SmoothScrollLink></li>)}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs lg:text-sm" asChild><Link href="/login">Masuk</Link></Button>
          <Button size="sm" className="rounded-full px-4 text-xs lg:px-5 lg:text-sm" asChild><Link href="/register">Buat Undangan</Link></Button>
        </div>
        <Button variant="outline" size="icon" onClick={isOpen.toggle} className="size-10 rounded-full border-border bg-background/70 md:hidden" aria-expanded={isOpen.isOpen} aria-controls="mobile-navigation" aria-label={isOpen.isOpen ? "Tutup menu" : "Buka menu"}><MenuIcon className="size-4" /></Button>
      </Scale>
      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}