"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/frontend";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { loginButton } from "./constant";
import { MobileHeader } from "./mobile-navbar";
import { useScroll } from "./use-scroll";

export function Navbar() {
  const isScrolled = useScroll();
  const isOpen = useOverlay();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:inline-block">
          <ul className="flex items-center gap-12">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="text-sm hover:text-accent transition-colors"
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          size="sm"
          className="hidden md:inline-flex px-4 rounded-full"
          asChild
        >
          <Link href={loginButton.href}>{loginButton.label}</Link>
        </Button>
        <button
          onClick={isOpen.toggle}
          className="md:hidden size-6"
          aria-expanded={isOpen.isOpen}
          aria-label="Toggle Menu"
        >
          <Menu className="size-4" />
        </button>
      </div>

      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}
