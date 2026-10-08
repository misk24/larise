"use client";

import { Scale } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { loginButton, navLinks } from "./constant";
import { MobileHeader } from "./mobile-navbar";
import { useScroll } from "./use-scroll";

export function Navbar() {
  const isScrolled = useScroll();
  const isOpen = useOverlay();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-foreground/10 bg-background/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <Scale
        className={cn(
          "mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 transition-all duration-500 md:px-8",
          isScrolled && "h-[68px]",
        )}
      >
        <SmoothScrollLink
          href="/"
          className="shrink-0"
          aria-label="Larisé, beranda"
        >
          <Logo width={170} height={56} alt="Larisé" />
        </SmoothScrollLink>

        <nav className="hidden md:block" aria-label="Navigasi utama">
          <ul className="flex items-center gap-9">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <SmoothScrollLink
                  href={link.href}
                  className="group relative inline-flex items-center gap-1.5 py-2 text-[13px] font-medium tracking-[0.01em] text-foreground/70 transition-colors hover:text-foreground"
                >
                  <span className="absolute -left-3 text-[9px] font-normal tracking-normal text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </SmoothScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={loginButton.href}
            className="text-[13px] font-medium text-foreground/65 transition-colors hover:text-foreground"
          >
            {loginButton.label}
          </Link>

          <Button
            size="sm"
            className="group h-10 rounded-full px-5 text-[13px] shadow-none"
            asChild
          >
            <Link href="/register">
              {loginButton.ctaLabel}
              <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={isOpen.toggle}
          className="size-10 rounded-full md:hidden"
          aria-expanded={isOpen.isOpen}
          aria-label={isOpen.isOpen ? "Tutup menu" : "Buka menu"}
        >
          <MenuIcon className="size-[18px]" />
        </Button>
      </Scale>

      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}
