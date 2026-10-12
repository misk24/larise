"use client";

import { Scale } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { loginButton, navLinks } from "./constant";
import { MobileHeader } from "./mobile-navbar";
import { useScroll } from "./use-scroll";

export function Navbar() {
  const isScrolled = useScroll();
  const menu = useOverlay();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300 md:px-6 md:pt-5",
      )}
    >
      <Scale
        className={cn(
          "mx-auto flex h-[60px] max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-300 md:h-[68px] md:px-7",
          isScrolled
            ? "border-border/70 bg-background/90 shadow-sm backdrop-blur-xl"
            : "border-foreground/10 bg-background/65 backdrop-blur-md",
        )}
      >
        <SmoothScrollLink href="/" className="flex shrink-0 items-center">
          <Logo alt="Larisé" width={138} height={46} className="h-6 md:h-7" />
        </SmoothScrollLink>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="text-sm text-foreground/75 transition-colors hover:text-foreground"
              >
                <SmoothScrollLink href={link.href}>{link.label}</SmoothScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          size="sm"
          variant="outline"
          className="hidden rounded-full border-foreground/20 bg-transparent px-5 md:inline-flex"
          asChild
        >
          <Link href={loginButton.href}>
            {loginButton.label}
            <ArrowUpRight className="ml-1 size-3.5" aria-hidden="true" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={menu.toggle}
          className="size-10 rounded-full border-foreground/15 bg-transparent md:hidden"
          aria-expanded={menu.isOpen}
          aria-controls="mobile-navigation"
          aria-label={menu.isOpen ? "Tutup menu" : "Buka menu"}
        >
          <Menu className="size-4" aria-hidden="true" />
        </Button>
      </Scale>

      <MobileHeader isOpen={menu.isOpen} onClose={menu.close} />
    </header>
  );
}
