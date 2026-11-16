"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";

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
export default function ThemeSettingsForm({ theme }: { theme: Theme }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: theme.name, slug: theme.slug, description: theme.description ?? "",
    thumbnail_url: theme.thumbnail_url ?? "", preview_url: theme.preview_url ?? "",
    price: String(theme.price ?? 0), category: theme.category || "minimalist",
    features: (theme.features ?? []).join("\n"), is_premium: theme.is_premium,
  });
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [success, setSuccess] = useState(false);
  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm(current => ({ ...current, [key]: value })); setSuccess(false); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess(false);
    try {
      const response = await fetch(`/api/admin/themes/${theme.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, price: Number(form.price),
          description: form.description.trim() || null,
          thumbnail_url: form.thumbnail_url.trim() || null,
          preview_url: form.preview_url.trim() || null,
          features: form.features.split("\n").map(item => item.trim()).filter(Boolean),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Konfigurasi tema gagal disimpan.");
      setSuccess(true); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Terjadi kesalahan."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-8">
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold">Informasi dasar</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="theme-name">Nama tema</Label><Input id="theme-name" value={form.name} maxLength={80} onChange={e=>update("name",e.target.value)} required /></div>
        <div className="space-y-2"><Label htmlFor="theme-slug">Slug</Label><Input id="theme-slug" value={form.slug} maxLength={100} aria-describedby="theme-slug-hint" onChange={e=>update("slug",e.target.value)} required /><p id="theme-slug-hint" className="text-xs text-muted-foreground">Huruf kecil, angka, dan tanda hubung.</p></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="theme-description">Deskripsi</Label><Textarea id="theme-description" value={form.description} maxLength={500} rows={3} aria-describedby="theme-description-count" onChange={e=>update("description",e.target.value)} /><p id="theme-description-count" className="text-right text-xs tabular-nums text-muted-foreground">{form.description.length}/500</p></div>
      </div>
    </fieldset>

    <fieldset className="space-y-4 border-t pt-6">
      <legend className="text-sm font-semibold">Kategori dan harga</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="theme-category">Kategori</Label><Select value={form.category} onValueChange={value=>update("category",value)}><SelectTrigger id="theme-category" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{categories.map(item=><SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label htmlFor="theme-price">Harga</Label><div className="relative"><span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span><Input id="theme-price" type="number" inputMode="numeric" min="0" step="1" value={form.price} onChange={e=>update("price",e.target.value)} className="pl-9 tabular-nums" required /></div></div>
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
      <div className="space-y-2"><Label htmlFor="theme-features" className="sr-only">Fitur tema</Label><Textarea id="theme-features" value={form.features} onChange={e=>update("features",e.target.value)} rows={4} aria-describedby="theme-features-hint" placeholder={"Tipografi elegan\nLayout editorial\nMobile-first"} /><p id="theme-features-hint" className="text-xs text-muted-foreground">Satu fitur per baris, maksimal 20 fitur.</p></div>
    </fieldset>

    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div aria-live="polite" className="min-h-5 text-sm">
        {error ? <p role="alert" className="text-destructive">{error}</p> : null}
        {success ? <p role="status" className="inline-flex items-center gap-1.5 text-success"><CheckCircle2Icon aria-hidden="true" className="size-4" />Konfigurasi tema berhasil disimpan.</p> : null}
      </div>
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? <><Loader2Icon aria-hidden="true" className="size-4 animate-spin" />Menyimpan...</> : "Simpan konfigurasi"}</Button>
    </div>
  </form>;
}
