"use client";

import { deleteAccount } from "@/lib/actions/auth";
import { AlertTriangleIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountDangerZoneProps = {
  provider: string | null;
  email: string;
};

export function AccountDangerZone({ provider, email }: AccountDangerZoneProps) {
  const isEmailAccount = provider === "email";
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEmailAccount) return;
    if (confirmationEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      toast.error("Email konfirmasi tidak cocok dengan email akun.");
      return;
    }
    if (!password) {
      toast.error("Masukkan password untuk memverifikasi identitas Anda.");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount({ currentPassword: password, confirmationEmail });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // A successful deletion redirects from the server action.
      toast.success("Akun berhasil dihapus.");
    } catch {
      toast.error("Akun belum dapat dihapus. Coba lagi nanti.");
    } finally {
      setIsDeleting(false);
    }
  }

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
              Tindakan di bagian ini berdampak permanen pada akun Anda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Hapus akun LARISÉ</p>
            <p className="max-w-xl text-sm leading-5 text-muted-foreground">
              Penghapusan akun bersifat permanen. Anda akan kehilangan akses ke akun dan data yang terhubung,
              dan tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            className="w-full shrink-0 sm:w-auto"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
          >
            <Trash2Icon className="mr-2 size-4" />
            {isOpen ? "Batal" : "Hapus akun"}
          </Button>
        </div>

        {!isEmailAccount && (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-5 text-muted-foreground">
            Penghapusan mandiri untuk akun Google belum tersedia karena perlu verifikasi ulang melalui Google.
            Demi keamanan, tindakan ini dinonaktifkan untuk akun ini. Hubungi dukungan LARISÉ untuk meminta penghapusan akun.
          </div>
        )}

        {isOpen && isEmailAccount && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div className="rounded-lg border border-destructive/25 bg-destructive/[0.04] p-3 text-sm leading-5">
              <p className="font-medium text-destructive">Pastikan Anda memahami konsekuensinya.</p>
              <p className="mt-1 text-muted-foreground">
                Untuk melanjutkan, masukkan password saat ini dan ketik email akun Anda sebagai konfirmasi.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-account-password">Password saat ini</Label>
              <Input
                id="delete-account-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isDeleting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-account-email">Email akun</Label>
              <Input
                id="delete-account-email"
                type="email"
                autoComplete="email"
                value={confirmationEmail}
                onChange={(event) => setConfirmationEmail(event.target.value)}
                placeholder={email}
                disabled={isDeleting}
                required
              />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
                Batal
              </Button>
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <Trash2Icon className="mr-2 size-4" />}
                {isDeleting ? "Menghapus akun..." : "Hapus akun secara permanen"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
