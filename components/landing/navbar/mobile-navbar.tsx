import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { ArrowUpRight, XIcon } from "lucide-react";
import Link from "next/link";
import { loginButton, navLinks, registerButton } from "./constant";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      aria-hidden={!isOpen}
      className={`absolute inset-x-0 top-0 border-b border-primary/10 bg-card transition-all duration-300 ease-out lg:hidden ${
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0"
      }`}
    >
      <div className="px-6 pt-4 pb-8 sm:px-8">
        <div className="flex items-center justify-between">
          <p className=" text-[10px] uppercase tracking-[0.24em] text-accent">
            Explore Larise
          </p>

          <Button
            variant="link"
            size="icon"
            onClick={onClose}
            className="-mr-2 text-accent focus:outline-none"
            aria-label="Close Menu"
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        <div className="divide-y divide-primary/10">
          {navLinks.map((item, index) => (
            <SmoothScrollLink
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-4 text-[22px] tracking-tight text-primary"
            >
              {item.label}

              <ArrowUpRight
                size={18}
                strokeWidth={1.5}
                className="text-accent"
              />
            </SmoothScrollLink>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-full text-[12px]"
            asChild
          >
            <Link href={loginButton.href}>{loginButton.label}</Link>
          </Button>

          <Button className="h-12 rounded-full text-[12px]" asChild>
            <Link href={registerButton.href}>{registerButton.label}</Link>
          </Button>
        </div>

        <p className="mt-6 text-center text-[10px] tracking-wide text-primary/45">
          Your story, beautifully invited.
        </p>
      </div>
    </div>
  );
}
