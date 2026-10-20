"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeAccountPassword } from "@/lib/actions/auth";
import type { Profile } from "@/types/database";
import { CheckCircle2Icon, EyeIcon, EyeOffIcon, KeyRoundIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

type LoginSecurityCardProps = {
  provider: Profile["provider"];
  email: string;
};

export function LoginSecurityCard({ provider, email }: LoginSecurityCardProps) {
  const isGoogleAccount = provider === "google";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password belum cocok.");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("Password baru harus berbeda dari password saat ini.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await changeAccountPassword({ currentPassword, newPassword });
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password berhasil diperbarui.");
    } catch {
      toast.error("Password belum berhasil diperbarui. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <ShieldCheckIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Login &amp; Security</CardTitle>
            <CardDescription className="leading-5">
              Kelola keamanan akses untuk akun LARISÉ Anda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <KeyRoundIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium">Metode login</p>
            <p className="text-sm text-muted-foreground">
              {isGoogleAccount ? "Google Account" : "Email dan password"}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <CheckCircle2Icon className="size-3.5" />
            Terhubung
          </span>
        </div>

        <div className="space-y-1">
          <Label htmlFor="security-email">Email login</Label>
          <Input id="security-email" type="email" value={email} disabled readOnly />
        </div>

        <div className="border-t pt-5">
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-medium">Ubah password</h3>
            <p className="text-sm leading-5 text-muted-foreground">
              {isGoogleAccount
                ? "Akun ini menggunakan Google untuk autentikasi. Password dikelola oleh Google, sehingga perubahan password di LARISÉ dinonaktifkan."
                : "Masukkan password saat ini untuk verifikasi, lalu buat password baru minimal 8 karakter."}
            </p>
          </div>

          {isGoogleAccount ? (
            <div className="space-y-3" aria-describedby="google-password-help">
              <div className="space-y-2">
                <Label htmlFor="google-current-password">Password saat ini</Label>
                <Input id="google-current-password" type="password" value="" disabled placeholder="Dikelola oleh Google" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-new-password">Password baru</Label>
                <Input id="google-new-password" type="password" value="" disabled placeholder="Tidak tersedia untuk akun Google" />
              </div>
              <Button type="button" disabled className="w-full sm:w-auto">
                Ubah password
              </Button>
              <p id="google-password-help" className="text-xs leading-5 text-muted-foreground">
                Untuk mengganti password, buka pengaturan keamanan akun Google Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security-current-password">Password saat ini</Label>
                <Input
                  id="security-current-password"
                  type={showPasswords ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="security-new-password">Password baru</Label>
                <Input
                  id="security-new-password"
                  type={showPasswords ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="security-confirm-password">Konfirmasi password baru</Label>
                <Input
                  id="security-confirm-password"
                  type={showPasswords ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                onClick={() => setShowPasswords((value) => !value)}
                aria-pressed={showPasswords}
              >
                {showPasswords ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                {showPasswords ? "Sembunyikan password" : "Tampilkan password"}
              </button>
              <div className="flex justify-end border-t pt-4">
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <KeyRoundIcon className="mr-2 size-4" />}
                  {isSaving ? "Menyimpan..." : "Ubah password"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
