"use client";

import { BrandLogo } from "@/components/landing/ui/brand-logo";
import { LandingButton, landingButtonStyles } from "@/components/landing/ui/button";
import { LandingScrollLink } from "@/components/landing/ui/smooth-scroll-link";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { navigation } from "./navbar";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  return (
    <div
      id="mobile-navigation"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={[
        "absolute inset-x-0 top-full grid overflow-hidden border-b border-[#29271F]/10 bg-[#F8F6F1] shadow-xl shadow-[#29271f]/10 transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        "motion-reduce:transition-none",
        isOpen
          ? "visible grid-rows-[1fr] opacity-100"
          : "invisible grid-rows-[0fr] opacity-0",
      ].join(" ")}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="px-5 pb-7 pt-4 sm:px-8">
          <div className="flex items-center justify-between border-b border-[#29271F]/10 pb-4">
            <BrandLogo width={132} height={44} className="h-6" />
            <LandingButton
              variant="icon"
              size="icon"
              onClick={onClose}
              className="size-9"
              aria-label="Tutup menu"
            >
              <XIcon className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-90 motion-reduce:transition-none" />
            </LandingButton>
          </div>
          <nav aria-label="Navigasi mobile" className="divide-y divide-[#29271F]/10">
            {navigation.map((item, index) => (
              <LandingScrollLink
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={{ transitionDelay: isOpen ? `${index * 45}ms` : "0ms" }}
                className={[
                  "flex items-center py-4 text-xl tracking-tight text-[#29271F] transition-[color,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#927653] motion-reduce:transition-none",
                  isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                ].join(" ")}
              >
                {item.label}
              </LandingScrollLink>
            ))}
          </nav>
          <div
            className={[
              "mt-5 grid grid-cols-2 gap-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: isOpen ? "160ms" : "0ms" }}
          >
            <Link
              href="/login"
              onClick={onClose}
              className={landingButtonStyles({ variant: "secondary", size: "md", className: "min-h-11" })}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className={landingButtonStyles({ size: "md", className: "min-h-11" })}
            >
              Buat Undangan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
