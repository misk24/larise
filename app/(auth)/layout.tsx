import { BrandLogo } from "@/components/landing/ui/brand-logo";
import type { Viewport } from "next";
import Image from "next/image";
import Link from "next/link";

export const viewport: Viewport = {
  themeColor: "#F8F6F1",
  width: "device-width",
  initialScale: 1,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="frontend-shell grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex min-h-svh flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Link href="/" aria-label="LARISÉ, kembali ke beranda" className="w-fit">
          <BrandLogo width={150} height={50} className="h-7" />
        </Link>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</main>
      </div>
      {/* Photo panel only from lg up; on mobile the form is the whole page. */}
      <aside aria-label="Tentang LARISÉ" className="relative hidden lg:block">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        <p className="frontend-display absolute bottom-12 left-12 max-w-sm text-5xl leading-none tracking-[-0.05em] text-ivory">
          Cerita indahmu, dimulai di sini.
        </p>
      </aside>
    </div>
  );
}
