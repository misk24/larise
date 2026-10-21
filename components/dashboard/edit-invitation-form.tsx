"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, LockKeyhole, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationThemeList } from "@/components/dashboard/invitation-theme-list";
import { updateInvitation } from "@/lib/actions/invitations";

type Theme = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  features: unknown;
  price: number;
  is_premium: boolean;
};

type Invitation = {
  id: string;
  theme_id: string | null;
  slug: string;
  status: string;
  is_published: boolean;
  groom_name: string;
  groom_nickname: string;
  bride_name: string;
  bride_nickname: string;
  name_order: "groom_first" | "bride_first";
};

export function EditInvitationForm({ invitation, themes }: { invitation: Invitation; themes: Theme[] }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [themeId, setThemeId] = useState(invitation.theme_id ?? "");
  const [groomName, setGroomName] = useState(invitation.groom_name);
  const [groomNickname, setGroomNickname] = useState(invitation.groom_nickname);
  const [brideName, setBrideName] = useState(invitation.bride_name);
  const [brideNickname, setBrideNickname] = useState(invitation.bride_nickname);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function continueToThemes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!groomName.trim() || !groomNickname.trim() || !brideName.trim() || !brideNickname.trim()) {
      toast.error("Lengkapi informasi kedua mempelai terlebih dahulu.");
      return;
    }
    setStep(2);
  }

  async function save() {
    if (!themeId) {
      toast.error("Pilih tema untuk melanjutkan.");
      return;
    }

    setSaving(true);
    try {
      const result = await updateInvitation(invitation.id, {
        themeId,
        groomName,
        groomNickname,
        brideName,
        brideNickname,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Perubahan undangan tersimpan.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const nameOrderLabel = invitation.name_order === "groom_first"
    ? "Mempelai laki-laki dahulu"
    : "Mempelai wanita dahulu";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
          <span>LANGKAH {step} DARI 2</span>
          <span>{step === 1 ? "Informasi dasar" : "Pilih tema"}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={continueToThemes} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi dasar</CardTitle>
              <CardDescription>
                Perbarui nama mempelai jika diperlukan. Slug dan urutan nama tetap terkunci; tanggal acara dikelola di builder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="groomName">Nama lengkap mempelai laki-laki</Label>
                  <Input id="groomName" value={groomName} onChange={(event) => setGroomName(event.target.value)} maxLength={120} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomNickname">Nama panggilan mempelai laki-laki</Label>
                  <Input id="groomNickname" value={groomNickname} onChange={(event) => setGroomNickname(event.target.value)} maxLength={60} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideName">Nama lengkap mempelai wanita</Label>
                  <Input id="brideName" value={brideName} onChange={(event) => setBrideName(event.target.value)} maxLength={120} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideNickname">Nama panggilan mempelai wanita</Label>
                  <Input id="brideNickname" value={brideNickname} onChange={(event) => setBrideNickname(event.target.value)} maxLength={60} required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lockedSlug">Slug undangan</Label>
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
                    <Input id="lockedSlug" value={invitation.slug} disabled readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">URL tidak berubah saat nama atau status publikasi berubah.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockedNameOrder">Urutan nama pasangan</Label>
                  <Input id="lockedNameOrder" value={nameOrderLabel} disabled readOnly />
                  <p className="text-xs text-muted-foreground">Dikunci sejak draft dibuat.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit">Lanjut pilih tema <ArrowRight className="ml-2 size-4" /></Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pilih tema undangan</CardTitle>
              <CardDescription>Tema dapat diganti kapan saja. Tanggal, jadwal, dan detail acara diatur di builder.</CardDescription>
            </CardHeader>
            <CardContent>
              {themes.length ? (
                <InvitationThemeList themes={themes} selectedThemeId={themeId} onSelect={setThemeId} />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Belum ada tema aktif yang tersedia.
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={saving}>
              <ArrowLeft className="mr-2 size-4" /> Kembali
            </Button>
            <Button type="button" onClick={save} disabled={saving || !themeId || !groomName.trim() || !groomNickname.trim() || !brideName.trim() || !brideNickname.trim()}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <><Check className="mr-2 size-4" /><Save className="mr-2 size-4" /></>}
              Simpan perubahan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
