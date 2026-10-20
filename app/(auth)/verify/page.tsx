import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { MailCheckIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LARISÉ - Verifikasi Email",
  description: "Periksa email Anda untuk mengaktifkan akun LARISÉ",
};

export default function VerifyEmailPage() {
  return (
    <Card className="w-full max-w-md bg-sidebar">
      <CardHeader className="mb-4 flex flex-col items-center gap-4">
        <CardTitle>
          <Logo />
        </CardTitle>
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-background">
          <MailCheckIcon className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-heading text-2xl tracking-tight">Cek email kamu</h2>
          <CardDescription className="text-center">
            Satu langkah lagi sebelum kamu mulai merangkai undangan di LARISÉ.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="border border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
          Kami sudah mengirim tautan verifikasi ke alamat email yang kamu daftarkan.
          Buka email tersebut, lalu klik tautannya untuk mengaktifkan akun.
          Jika belum terlihat, periksa juga folder spam atau promosi.
        </div>
        <Button asChild size="lg" className="w-full">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka Gmail
          </a>
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground">
          Sudah verifikasi email?
        </p>
        <Button variant="link" asChild className="text-primary">
          <Link href="/login">Kembali ke halaman masuk</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
