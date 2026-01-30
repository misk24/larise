import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/frontend";
import { X } from "lucide-react";
import Link from "next/link";
import { loginButton } from "./constant";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-screen text-muted bg-foreground/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 hover:text-accent transition-colors focus:outline-none"
        aria-label="Close Menu"
      >
        <X className="size-4" />
      </button>
      <nav className="mt-24 px-6">
        <ul className="space-y-12">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onClose}>
                <span className="font-heading text-3xl hover:text-accent transition-colors">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Button
        variant="link"
        className="mt-30 px-6 font-heading text-3xl text-muted hover:text-accent bg-transparent transition-colors"
        asChild
      >
        <Link href={loginButton.href} onClick={onClose}>
          {loginButton.label}
        </Link>
      </Button>
    </div>
  );
}
