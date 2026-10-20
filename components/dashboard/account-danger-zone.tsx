"use client";

import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AccountDangerZoneProps = {
  provider: string | null;
  email: string;
};

export function AccountDangerZone({ provider, email }: AccountDangerZoneProps) {
  const isGoogleAccount = provider === "google";

  return (
    <Card className="border-destructive/40 shadow-none">
      <CardHeader className="border-b border-destructive/20 bg-destructive/[0.04] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangleIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription className="leading-5">
              Tindakan di bagian ini dapat berdampak permanen pada akun Anda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Hapus akun LARISÉ</p>
            <p className="max-w-xl text-sm leading-5 text-muted-foreground">
              Penghapusan akun akan menghentikan akses ke akun Anda dan dapat memengaruhi data yang terhubung.
              Fitur ini belum tersedia sampai penanganan undangan, tamu, RSVP, pesanan, dan file terkait
              dipastikan aman.
            </p>
          </div>
          <Button type="button" variant="destructive" className="w-full shrink-0 sm:w-auto" disabled>
            <Trash2Icon className="mr-2 size-4" />
            Belum tersedia
          </Button>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-5 text-muted-foreground">
          {isGoogleAccount
            ? "Akun ini menggunakan Google. Penghapusan mandiri nantinya juga memerlukan verifikasi ulang melalui Google."
            : "Penghapusan mandiri nantinya akan meminta verifikasi password dan konfirmasi email sebelum diproses."}
          {" "}Tidak ada data akun yang dihapus oleh bagian ini.
        </div>
      </CardContent>
    </Card>
  );
}
