"use client";

import { Scale } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { loginButton, navLinks, registerButton } from "./constant";
import { MobileHeader } from "./mobile-navbar";
import { useScroll } from "./use-scroll";

export function Navbar() {
  const isScrolled = useScroll();
  const isOpen = useOverlay();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <Scale className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 md:px-8">
        <SmoothScrollLink href="/">
          <Logo />
        </SmoothScrollLink>

        <nav className="hidden md:inline-block">
          <ul className="flex items-center gap-6 lg:gap-12">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="text-sm hover:text-accent transition-colors"
              >
                <SmoothScrollLink href={link.href}>
                  {link.label}
                </SmoothScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="border-background hover:border-accent hover:text-primary-foreground rounded-full"
            asChild
          >
            <Link href={loginButton.href}>{loginButton.label}</Link>
          </Button>
          <Button size="sm" className="rounded-full" asChild>
            <Link href={registerButton.href}>{registerButton.label}</Link>
          </Button>
        </div>

        <Button
          variant="link"
          size="icon"
          onClick={isOpen.toggle}
          className="md:hidden -mr-2"
          aria-expanded={isOpen.isOpen}
          aria-label="Toggle Menu"
        >
          <MenuIcon className="size-4" />
        </Button>
      </Scale>

      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}
