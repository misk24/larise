import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { loginButton, navLinks } from "./constant";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      className="fixed inset-0 z-[60] flex min-h-svh flex-col overflow-y-auto bg-background/98 px-6 pb-8 pt-5 text-foreground backdrop-blur-xl md:hidden"
    >
      <div className="flex h-12 items-center justify-between">
        <Link href="/" onClick={onClose} className="inline-flex items-center">
          <span className="font-heading text-xl tracking-[-0.04em]">Larisé</span>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="size-10 rounded-full border-foreground/15 bg-transparent"
          aria-label="Tutup menu"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <nav aria-label="Navigasi utama mobile" className="mt-16">
        <ul className="divide-y divide-border">
          {navLinks.map((link, index) => (
            <li key={link.href} className="py-5">
              <SmoothScrollLink
                href={link.href}
                onClick={onClose}
                className="flex items-baseline gap-4"
              >
                <span className="text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-3xl tracking-tight">
                  {link.label}
                </span>
              </SmoothScrollLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-12">
        <Link
          href={loginButton.href}
          onClick={onClose}
          className="flex min-h-14 items-center justify-between rounded-full bg-foreground px-6 text-background transition-opacity hover:opacity-85"
        >
          <span>{loginButton.label}</span>
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </Link>
        <p className="mt-5 text-xs tracking-wide text-muted-foreground">
          Ruang untuk cerita yang hanya milik kalian.
        </p>
      </div>
    </div>
  );
}
