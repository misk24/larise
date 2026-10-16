import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { ArrowUpRight, XIcon } from "lucide-react";
import Link from "next/link";
import { navigation } from "./navbar";

interface MobileHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileHeader({ isOpen, onClose }: MobileHeaderProps) {
  if (!isOpen) return null;

  return (
    <div id="mobile-navigation" aria-hidden={!isOpen} className="absolute inset-x-0 top-0 border-b border-border bg-background shadow-xl shadow-[#29271f]/10 md:hidden">
      <div className="px-5 pb-7 pt-4 sm:px-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Jelajahi LARISÉ</p>
          <Button variant="outline" size="icon" onClick={onClose} className="size-9 rounded-full" aria-label="Tutup menu"><XIcon className="size-4" /></Button>
        </div>
        <nav aria-label="Navigasi mobile" className="divide-y divide-border">
          {navigation.map((item, index) => (
            <SmoothScrollLink key={item.label} href={item.href} onClick={onClose} className="flex items-center justify-between py-4 text-xl tracking-tight text-foreground">
              <span className="flex items-center gap-4"><span className="text-[10px] tracking-[0.18em] text-accent">{String(index + 1).padStart(2, "0")}</span>{item.label}</span>
              <ArrowUpRight size={18} strokeWidth={1.4} className="text-accent" />
            </SmoothScrollLink>
          ))}
        </nav>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="h-11 rounded-full" asChild><Link href="/login">Masuk</Link></Button>
          <Button size="lg" className="h-11 rounded-full" asChild><Link href="/register">Buat Undangan</Link></Button>
        </div>
        <p className="mt-5 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your story, beautifully invited.</p>
      </div>
    </div>
  );
}