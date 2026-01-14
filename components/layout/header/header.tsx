"use client";

import { MENU_ITEMS } from "@/constants/menu";
import { useGsapReveal } from "@/hooks/use-gsap";
import { useOverlay } from "@/hooks/use-overlay";
import { CTA_BUTTON, LOGO } from "./constant";
import { Button } from "../../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import MobileHeader from "../mobile-header/header";

export function Header() {
  const mobileMenu = useOverlay();
  const headerRef = useRef<HTMLDivElement>(null);
  useGsapReveal(headerRef);

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/">
          <span className="text-2xl font-heading tracking-widest">{LOGO}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:inline-block">
          <ul className="flex items-center gap-12">
            {MENU_ITEMS.map((menu, index) => (
              <li key={index} className="font-heading hover:text-accent transition-colors">
                <Link href={menu.href}>{menu.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={CTA_BUTTON.href}>
          <Button size="sm" className="hidden md:inline-flex px-4 rounded-full cursor-pointer">
            {CTA_BUTTON.label}
          </Button>
        </Link>

        <button onClick={mobileMenu.toggle} className="md:hidden w-6 h-6" aria-expanded={mobileMenu.isOpen} aria-label="Toggle Menu">
          <Menu />
        </button>
      </div>

      <MobileHeader isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} />
    </header>
  );
}