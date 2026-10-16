"use client";

import { FadeIn } from "@/components/motion";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { contacts } from "@/config/contact";
import { Icon } from "@iconify/react";
import { ArrowUpRight, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { navigation } from "../navbar/navbar";

export function Footer() {
  return (
    <footer className="bg-[#29271f] px-5 pb-7 pt-12 text-[#faf9f6] sm:px-8 sm:pt-16">
      <FadeIn className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.2fr_0.7fr_0.8fr] md:gap-12 md:pb-14">
          <div className="max-w-sm">
            <SmoothScrollLink href="/" aria-label="LARISÉ, kembali ke atas"><Logo variant="footer" width={160} height={54} className="h-7" /></SmoothScrollLink>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">Undangan digital yang personal, untuk cerita dan hari yang berarti.</p>
            <Link href="/register" className="mt-6 inline-flex items-center gap-2 text-sm text-[#c8b18f] transition-colors hover:text-white">Mulai buat undangan <ArrowUpRight className="size-4" /></Link>
          </div>
          <div>
            <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#c8b18f]">Jelajahi</h3>
            <ul className="space-y-3">
              {navigation.map((link) => <li key={link.href}><SmoothScrollLink href={link.href} className="text-sm text-white/65 transition-colors hover:text-white">{link.label}</SmoothScrollLink></li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#c8b18f]">Terhubung</h3>
            <ul className="space-y-3">
              {contacts.map((contact) => <li key={contact.label}><a href={contact.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"><Icon icon={"simple-icons:" + contact.icon} className="size-3.5" /><span>{contact.label}</span><ArrowUpRight className="size-3 opacity-50" /></a></li>)}
              <li className="inline-flex items-center gap-2 text-sm text-white/65"><MapPinIcon className="size-4 text-[#c8b18f]" /><span>Lombok Timur, NTB</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <span>© {new Date().getFullYear()} LARISÉ. Dibuat dengan perhatian.</span><span>Undangan digital, sentuhan personal.</span>
        </div>
      </FadeIn>
    </footer>
  );
}