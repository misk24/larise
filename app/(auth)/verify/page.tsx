import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Verifikasi Email | LARISÉ",
  description: "Periksa email untuk menyelesaikan pendaftaran akun LARISÉ.",
};

export default function VerifyEmailPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex size-12 items-center justify-center border border-[var(--auth-line)] bg-[var(--auth-paper)] text-[var(--auth-olive)]">
          <MailCheckIcon aria-hidden="true" className="size-5" />
        </div>
        <div className="space-y-2">
          <CardTitle>Periksa email kamu</CardTitle>
          <CardDescription>
            Satu langkah kecil lagi sebelum kamu mulai merangkai undangan
            pernikahan bersama LARISÉ.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="border-l-2 border-[var(--auth-olive)] bg-[var(--auth-paper)] px-4 py-3">
          <p className="text-sm leading-6 text-muted-foreground">
            Kami telah mengirim tautan verifikasi ke alamat email yang kamu
            daftarkan. Buka email tersebut dan klik tautannya untuk
            mengaktifkan akun.
          </p>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Belum melihat emailnya? Periksa folder spam atau promosi, lalu tunggu
          beberapa menit sebelum mencoba lagi.
        </p>

        <Button asChild className="w-full" size="lg">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka Gmail
          </a>
        </Button>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant="ghost">
          <Link href="/login">
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Kembali ke halaman masuk
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
