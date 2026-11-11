"use client";

import { landingButtonStyles } from "@/components/landing/ui/button";
import { LandingScrollLink } from "@/components/landing/ui/smooth-scroll-link";
import { navigation } from "@/config/landing-navigation";
import Link from "next/link";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
}

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function MobileHeader({ isOpen, onClose, isLoggedIn = false }: MobileHeaderProps) {
  return (
    <div
      id="mobile-navigation"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={[
        "absolute inset-x-0 top-full grid overflow-hidden border-b border-ink/10 bg-paper shadow-xl shadow-ink/10 transition-[grid-template-rows,opacity,visibility] duration-300 motion-reduce:transition-none md:hidden",
        ease,
        isOpen
          ? "visible grid-rows-[1fr] opacity-100"
          : "invisible grid-rows-[0fr] opacity-0",
      ].join(" ")}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="px-5 pb-7 pt-2 sm:px-8">
          <nav aria-label="Navigasi mobile" className="divide-y divide-ink/10">
            {navigation.map((item, index) => (
              <LandingScrollLink
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={{ transitionDelay: isOpen ? `${index * 45}ms` : "0ms" }}
                className={[
                  "flex items-center py-4 text-xl tracking-tight text-ink transition-[color,opacity,transform] duration-300 hover:text-gold-deep motion-reduce:transition-none",
                  ease,
                  isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                ].join(" ")}
              >
                {item.label}
              </LandingScrollLink>
            ))}
          </nav>
          <div
            className={[
              "mt-5 grid grid-cols-2 gap-3 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
              ease,
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: isOpen ? "160ms" : "0ms" }}
          >
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={onClose} className={landingButtonStyles({ className: "col-span-2" })}>
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={onClose} className={landingButtonStyles({ variant: "secondary" })}>
                  Masuk
                </Link>
                <Link href="/register" onClick={onClose} className={landingButtonStyles()}>
                  Buat Undangan
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
