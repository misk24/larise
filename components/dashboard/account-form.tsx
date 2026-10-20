"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";
import { CameraIcon, CheckCircle2Icon, Loader2Icon, SaveIcon, UserRoundIcon } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type AccountProfile = Pick<Profile, "id" | "email" | "provider" | "full_name" | "phone" | "avatar_url" | "role" | "created_at" | "updated_at">;

interface AccountFormProps {
  user: User;
  profile: AccountProfile;
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getInitials(name: string | null, email: string | undefined) {
  return name?.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join("").toUpperCase().slice(0, 2)
    || email?.[0]?.toUpperCase()
    || "L";
}

export function AccountForm({ user, profile }: AccountFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();

    if (!normalizedName) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (normalizedName.length > 120) {
      toast.error("Nama lengkap maksimal 120 karakter.");
      return;
    }
    if (normalizedPhone.length > 30) {
      toast.error("Nomor telepon maksimal 30 karakter.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateProfile({
        full_name: normalizedName,
        phone: normalizedPhone,
        avatar_url: avatarUrl || null,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profil berhasil diperbarui.");
    } catch {
      toast.error("Profil belum berhasil disimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error("Gunakan gambar JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Ukuran foto maksimal 2 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
      const path = `${user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });

      if (uploadError) {
        console.error("Avatar upload failed:", uploadError.message);
        toast.error("Foto belum dapat diunggah. Pastikan bucket profile-avatars sudah tersedia.");
        return;
      }

      const { data } = supabase.storage.from("profile-avatars").getPublicUrl(path);
      const nextAvatarUrl = `${data.publicUrl}?v=${Date.now()}`;
      const result = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: nextAvatarUrl,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }
      setAvatarUrl(nextAvatarUrl);
      toast.success("Foto profil berhasil diperbarui.");
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  }

  const initials = getInitials(fullName || profile.full_name, user.email);

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <Card className="overflow-hidden shadow-none">
        <CardHeader className="border-b bg-muted/20 px-5 py-4 sm:px-6">
          <CardTitle className="text-base">Informasi profil</CardTitle>
          <CardDescription>Informasi ini membantu Anda mengenali akun di dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-fit">
              <Avatar className="size-20 border">
                <AvatarImage src={avatarUrl || undefined} alt={fullName || "Foto profil"} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border bg-background">
                <CameraIcon className="size-3.5" />
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{fullName.trim() || "Nama belum diisi"}</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, atau WebP. Maksimal 2 MB.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarChange}
                aria-label="Pilih foto profil"
              />
              <Button type="button" variant="outline" size="sm" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                {isUploading ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <CameraIcon className="mr-2 size-4" />}
                {isUploading ? "Mengunggah..." : "Ganti foto"}
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-full-name">Nama lengkap</Label>
              <Input id="account-full-name" autoComplete="name" maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nama lengkap" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-phone">Nomor telepon <span className="font-normal text-muted-foreground">(opsional)</span></Label>
              <Input id="account-phone" type="tel" autoComplete="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Contoh: 081234567890" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-email">Alamat email</Label>
            <div className="relative">
              <Input id="account-email" type="email" value={user.email ?? ""} readOnly disabled className="pr-10" />
              <CheckCircle2Icon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Email login belum dapat diubah dari halaman ini. Ini mencegah perubahan email tanpa proses verifikasi Supabase.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Perubahan hanya berlaku untuk akun Anda.</p>
            <Button type="submit" disabled={isSaving || isUploading} className="w-full sm:w-auto">
              {isSaving ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <SaveIcon className="mr-2 size-4" />}
              Simpan perubahan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="flex items-start gap-3 p-4 sm:p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <UserRoundIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="font-medium">Akun LARISÉ</p>
            <p className="text-sm text-muted-foreground">
              Anda masuk menggunakan {profile.provider === "google" ? "Google" : "email dan password"}. Untuk menjaga keamanan, pengaturan metode login dikelola melalui proses autentikasi.
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
