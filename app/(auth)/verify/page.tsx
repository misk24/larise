import { AuthHeading } from "@/components/landing/ui/auth-heading";
import { landingButtonStyles } from "@/components/landing/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verifikasi Email | LARISÉ",
  description: "Periksa email untuk menyelesaikan pendaftaran akun LARISÉ.",
};

export default function VerifyEmailPage() {
  return (
    <>
      <AuthHeading
        title="Periksa email kamu"
        description="Satu langkah kecil lagi sebelum kamu mulai merangkai undangan pernikahan bersama LARISÉ."
      />

      <div className="space-y-5">
        <p className="border-l-2 border-gold-deep pl-4 text-sm leading-6 text-ink-soft">
          Kami telah mengirim tautan verifikasi ke alamat email yang kamu daftarkan. Buka email tersebut dan klik tautannya untuk mengaktifkan akun.
        </p>
        <p className="text-sm leading-6 text-ink-soft">
          Belum melihat emailnya? Periksa folder spam atau promosi, lalu tunggu beberapa menit sebelum mencoba lagi.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={landingButtonStyles({ size: "lg", className: "w-full" })}
        >
          Buka Gmail
        </a>
        <Link href="/login" className={landingButtonStyles({ variant: "text", size: "lg", className: "w-full" })}>
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          Kembali ke halaman masuk
        </Link>
      </div>
    </>
  );
}
