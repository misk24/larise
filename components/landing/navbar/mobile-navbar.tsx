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
  if (!isOpen) return null;

  return (
    <div id="mobile-navigation" aria-hidden={!isOpen} className="absolute inset-x-0 top-0 border-b border-[#29271F]/10 bg-[#F8F6F1] shadow-xl shadow-[#29271f]/10 md:hidden">
      <div className="px-5 pb-7 pt-4 sm:px-8">
        <div className="flex items-center justify-between border-b border-[#29271F]/10 pb-4">
          <BrandLogo width={132} height={44} className="h-6" />
          <LandingButton variant="icon" size="icon" onClick={onClose} className="size-9" aria-label="Tutup menu">
            <XIcon className="size-4" />
          </LandingButton>
        </div>
        <nav aria-label="Navigasi mobile" className="divide-y divide-[#29271F]/10">
          {navigation.map((item) => (
            <LandingScrollLink key={item.label} href={item.href} onClick={onClose} className="flex items-center py-4 text-xl tracking-tight text-[#29271F] transition-colors hover:text-[#927653]">
              {item.label}
            </LandingScrollLink>
          ))}
        </nav>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href="/login" className={landingButtonStyles({ variant: "secondary", size: "md", className: "min-h-11" })}>Masuk</Link>
          <Link href="/register" className={landingButtonStyles({ size: "md", className: "min-h-11" })}>Buat Undangan</Link>
        </div>
      </div>
    </div>
  );
}
