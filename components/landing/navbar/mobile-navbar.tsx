import { navLinks } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { loginButton } from "./constant";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen bg-foreground/95 backdrop-blur-sm text-primary-foreground overflow-y-auto">
      <Button
        variant="link"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-6 text-primary-foreground focus:outline-none"
        aria-label="Close Menu"
      >
        <X className="size-4" />
      </Button>

      <nav className="mt-24 px-6">
        <ul className="space-y-12">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onClose}>
                <span className="font-heading text-3xl">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-30 mb-12 px-6 font-heading text-3xl">
        <Link
          href={loginButton.href}
          onClick={onClose}
          className="flex items-center gap-4"
        >
          {loginButton.label} <ArrowUpRight className="size-[30]" />
        </Link>
      </div>
    </div>
  );
}
