"use client";
import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, ImageOffIcon, Loader2Icon, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";
import { BackendStatusBadge } from "@/components/backend/backend-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Theme = {
  id: string; name: string; slug: string; description: string | null;
  thumbnail_url: string | null; preview_url: string | null; price: number;
  category: string; features: string[] | null; is_premium: boolean;
};
const categories = [
  { value: "elegant", label: "Elegan" }, { value: "minimalist", label: "Minimalis" },
  { value: "traditional", label: "Tradisional" }, { value: "modern", label: "Modern" },
  { value: "rustic", label: "Rustic" }, { value: "floral", label: "Floral" },
];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_FEATURES = 20;
const formatPrice = (value: string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0);

export default function ThemeSettingsForm({ theme }: { theme: Theme }) {
  const router = useRouter();
  const initial = {
    name: theme.name, slug: theme.slug, description: theme.description ?? "",
    thumbnail_url: theme.thumbnail_url ?? "", preview_url: theme.preview_url ?? "",
    price: String(theme.price ?? 0), category: theme.category || "minimalist",
    features: (theme.features ?? []).join("\n"), is_premium: theme.is_premium,
  };
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [failedImage, setFailedImage] = useState("");
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const features = form.features.split("\n").map(item => item.trim()).filter(Boolean);
  const slugValid = SLUG_PATTERN.test(form.slug.trim());
  const featuresValid = features.length <= MAX_FEATURES && features.every(item => item.length <= 100);
  const canSave = dirty && !busy && slugValid && featuresValid && form.name.trim().length >= 2;
  const image = form.thumbnail_url.trim() || form.preview_url.trim();
  const categoryLabel = categories.find(item => item.value === form.category)?.label ?? form.category;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm(current => ({ ...current, [key]: value })); setError(""); }
  async function save() {
    if (!canSave) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/themes/${theme.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, price: Number(form.price),
          description: form.description.trim() || null,
          thumbnail_url: form.thumbnail_url.trim() || null,
          preview_url: form.preview_url.trim() || null,
          features,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Konfigurasi tema gagal disimpan.");
      setSaved(form);
      toast.success("Konfigurasi tema disimpan.");
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Terjadi kesalahan."); }
    finally { setBusy(false); }
  }
  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); void save(); }
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle role="heading" aria-level={2} className="text-base">Konfigurasi tema</CardTitle>
        <CardDescription>Informasi, harga, kategori, dan aset pratinjau yang tampil di katalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={event => { event.preventDefault(); void save(); }} onKeyDown={onKeyDown} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold">Informasi dasar</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="theme-name">Nama tema</Label><Input id="theme-name" value={form.name} maxLength={80} onChange={e=>update("name",e.target.value)} required minLength={2} /></div>
              <div className="space-y-2">
                <Label htmlFor="theme-slug">Slug</Label>
                <Input id="theme-slug" value={form.slug} maxLength={100} aria-invalid={!slugValid || undefined} aria-describedby="theme-slug-hint" onChange={e=>update("slug",e.target.value)} required />
                <p id="theme-slug-hint" className={cn("text-xs break-all", slugValid ? "text-muted-foreground" : "text-destructive")}>
                  {slugValid ? `Alamat katalog: /tema/${form.slug.trim()}` : "Gunakan huruf kecil, angka, dan tanda hubung tunggal."}
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2"><Label htmlFor="theme-description">Deskripsi</Label><Textarea id="theme-description" value={form.description} maxLength={500} rows={3} aria-describedby="theme-description-count" onChange={e=>update("description",e.target.value)} /><p id="theme-description-count" className="text-right text-xs tabular-nums text-muted-foreground">{form.description.length}/500</p></div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-6">
            <legend className="text-sm font-semibold">Kategori dan harga</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="theme-category">Kategori</Label><Select value={form.category} onValueChange={value=>update("category",value)}><SelectTrigger id="theme-category" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{categories.map(item=><SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="theme-price">Harga</Label><div className="relative"><span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span><Input id="theme-price" type="number" inputMode="numeric" min="0" max="1000000000" step="1" value={form.price} onChange={e=>update("price",e.target.value)} className="pl-9 tabular-nums" required /></div></div>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 p-4">
              <div className="space-y-1"><Label htmlFor="theme-premium">Tema premium</Label><p className="text-sm text-muted-foreground">Tandai tema ini sebagai premium di katalog.</p></div>
              <Switch id="theme-premium" checked={form.is_premium} onCheckedChange={value=>update("is_premium",value)} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-6">
            <legend className="text-sm font-semibold">Aset pratinjau</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="theme-thumbnail">URL thumbnail</Label><Input id="theme-thumbnail" type="url" value={form.thumbnail_url} onChange={e=>update("thumbnail_url",e.target.value)} placeholder="https://..." /></div>
              <div className="space-y-2"><Label htmlFor="theme-preview">URL preview</Label><Input id="theme-preview" type="url" value={form.preview_url} onChange={e=>update("preview_url",e.target.value)} placeholder="https://..." /></div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-6">
            <legend className="text-sm font-semibold">Fitur tema</legend>
            <div className="space-y-2">
              <Label htmlFor="theme-features" className="sr-only">Fitur tema</Label>
              <Textarea id="theme-features" value={form.features} onChange={e=>update("features",e.target.value)} rows={4} aria-invalid={!featuresValid || undefined} aria-describedby="theme-features-hint" placeholder={"Tipografi elegan\nLayout editorial\nMobile-first"} />
              <p id="theme-features-hint" className={cn("text-xs", featuresValid ? "text-muted-foreground" : "text-destructive")}>
                Satu fitur per baris, maksimal {MAX_FEATURES} fitur dan 100 karakter per fitur. <span className="tabular-nums">{features.length}/{MAX_FEATURES}</span>
              </p>
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite" className="min-h-5 text-sm">
              {error ? <p role="alert" className="text-destructive">{error}</p>
                : dirty ? <p className="text-muted-foreground">Ada perubahan yang belum disimpan.</p>
                : <p role="status" className="inline-flex items-center gap-1.5 text-muted-foreground"><CheckCircle2Icon aria-hidden="true" className="size-4" />Semua perubahan tersimpan.</p>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={busy || !dirty} onClick={() => { setForm(saved); setError(""); }}><RotateCcwIcon aria-hidden="true" className="size-4" />Kembalikan</Button>
              <Button type="submit" disabled={!canSave} className="flex-1 sm:flex-none">{busy ? <><Loader2Icon aria-hidden="true" className="size-4 animate-spin" />Menyimpan...</> : "Simpan konfigurasi"}</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>

    <aside aria-label="Pratinjau kartu katalog" className="min-w-0 space-y-3 xl:sticky xl:top-4 xl:self-start">
      <h3 className="text-sm font-semibold">Pratinjau kartu katalog</h3>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="relative aspect-[4/5] bg-muted">
          {image && failedImage !== image ? (
            // A plain img on purpose: the admin may paste any host while typing, which next/image would reject.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={`Pratinjau tema ${form.name}`} className="size-full object-cover" onError={() => setFailedImage(image)} />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOffIcon aria-hidden="true" className="size-6" />
              <p className="px-6 text-center text-xs">{image ? "Gambar tidak dapat dimuat. Periksa URL-nya." : "Belum ada gambar. Isi URL thumbnail atau preview."}</p>
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <BackendStatusBadge>{categoryLabel}</BackendStatusBadge>
            {form.is_premium ? <BackendStatusBadge tone="info">Premium</BackendStatusBadge> : null}
          </div>
          <p className="break-words font-semibold">{form.name || "Nama tema"}</p>
          {form.description.trim() ? <p className="line-clamp-3 text-sm text-muted-foreground">{form.description.trim()}</p> : null}
          <p className="text-sm font-medium tabular-nums">{formatPrice(form.price)}</p>
          {features.length ? <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">{features.slice(0, 3).map((item, index) => <li key={index} className="break-words">{item}</li>)}</ul> : null}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Ringkasan ini mengikuti isian form dan belum tersimpan sampai Anda menekan Simpan.</p>
    </aside>
  </div>;
}
