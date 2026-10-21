"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, FileHeart, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationThemeList } from "@/components/dashboard/invitation-theme-list";
import { createInvitation } from "@/lib/actions/invitations";
import { buildInvitationSlug } from "@/lib/validation/invitation";

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

type NameOrder = "groom_first" | "bride_first";

export function CreateInvitationForm({ themes }: { themes: Theme[] }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [themeId, setThemeId] = useState("");
  const [groomName, setGroomName] = useState("");
  const [groomNickname, setGroomNickname] = useState("");
  const [brideName, setBrideName] = useState("");
  const [brideNickname, setBrideNickname] = useState("");
  const [nameOrder, setNameOrder] = useState<NameOrder>("groom_first");
  const [loading, setLoading] = useState(false);

  const generatedSlug = useMemo(
    () =>
      nameOrder === "groom_first"
        ? buildInvitationSlug(groomNickname, brideNickname)
        : buildInvitationSlug(brideNickname, groomNickname),
    [nameOrder, groomNickname, brideNickname],
  );

  function continueToThemes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!groomName.trim() || !groomNickname.trim() || !brideName.trim() || !brideNickname.trim()) {
      toast.error("Lengkapi informasi dasar terlebih dahulu.");
      return;
    }
    setStep(2);
  }

  async function submit() {
    if (!themeId) {
      toast.error("Pilih tema untuk melanjutkan.");
      return;
    }

    setLoading(true);
    try {
      const result = await createInvitation({
        themeId,
        groomName,
        groomNickname,
        brideName,
        brideNickname,
        nameOrder,
      });
      if (result?.error) toast.error(result.error);
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) return;
      toast.error("Undangan gagal dibuat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
          <span>LANGKAH {step} DARI 2</span>
          <span>{step === 1 ? "Informasi dasar" : "Pilih tema"}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={continueToThemes} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi dasar</CardTitle>
              <CardDescription>
                Isi identitas kedua mempelai. Tanggal dan detail acara diatur nanti melalui builder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Urutan nama di undangan</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setNameOrder("groom_first")}
                    aria-pressed={nameOrder === "groom_first"}
                    className={`rounded-lg border p-3 text-left transition-colors ${nameOrder === "groom_first" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`}
                  >
                    <span className="block text-sm font-medium">Laki-laki dahulu</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Nama mempelai laki-laki, lalu wanita</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameOrder("bride_first")}
                    aria-pressed={nameOrder === "bride_first"}
                    className={`rounded-lg border p-3 text-left transition-colors ${nameOrder === "bride_first" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`}
                  >
                    <span className="block text-sm font-medium">Wanita dahulu</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Nama mempelai wanita, lalu laki-laki</span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Urutan ini akan dikunci setelah draft dibuat.</p>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Mempelai laki-laki</h3>
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Nama lengkap</Label>
                    <Input id="groomName" autoComplete="name" value={groomName} onChange={(event) => setGroomName(event.target.value)} maxLength={120} required placeholder="Nama lengkap mempelai laki-laki" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomNickname">Nama panggilan</Label>
                    <Input id="groomNickname" value={groomNickname} onChange={(event) => setGroomNickname(event.target.value)} maxLength={60} required placeholder="Nama yang biasa digunakan" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Mempelai wanita</h3>
                  <div className="space-y-2">
                    <Label htmlFor="brideName">Nama lengkap</Label>
                    <Input id="brideName" value={brideName} onChange={(event) => setBrideName(event.target.value)} maxLength={120} required placeholder="Nama lengkap mempelai wanita" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideNickname">Nama panggilan</Label>
                    <Input id="brideNickname" value={brideNickname} onChange={(event) => setBrideNickname(event.target.value)} maxLength={60} required placeholder="Nama yang biasa digunakan" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invitationSlug">Slug undangan</Label>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                    <LockKeyhole className="size-4" />
                  </div>
                  <Input id="invitationSlug" value={generatedSlug} readOnly disabled aria-describedby="slug-help" />
                </div>
                <p id="slug-help" className="text-xs text-muted-foreground">
                  larise.id/{generatedSlug || "nama-pasangan"}. Slug dibuat dari nama panggilan dan urutan pilihanmu, lalu dikunci saat draft dibuat.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit">
              Lanjut pilih tema <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pilih tema undangan</CardTitle>
              <CardDescription>
                Pilih desain untuk memulai. Tema dapat diganti nanti, sedangkan slug dan urutan nama tetap.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {themes.length ? (
                <InvitationThemeList themes={themes} selectedThemeId={themeId} onSelect={setThemeId} />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <FileHeart className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">Belum ada tema tersedia</p>
                  <p className="mt-1 text-sm text-muted-foreground">Coba lagi nanti atau hubungi administrator.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>
              <ArrowLeft className="mr-2 size-4" /> Kembali
            </Button>
            <Button type="button" onClick={submit} disabled={loading || !themeId}>
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
              Buat draft undangan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
