"use client";

import { useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type KeyboardEvent, type ReactNode, type SetStateAction } from "react";
import { ArrowLeft, Loader2Icon, Monitor, RotateCcw, Save, Smartphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThemeDecorationControls } from "@/components/admin/theme-decoration-controls";
import { ThemeSectionLivePreview } from "@/components/admin/theme-section-live-preview";
import {
  DesignColorField, DesignGroup, DesignNumberField, DesignRangeField, DesignSelectField, DesignTextField,
  parseContent, readDesign, writeDesignValue, type DesignControl,
} from "@/components/admin/theme-design-fields";
import { cn } from "@/lib/utils";

export type SectionDraft = { section_key: string; section_type: string; default_content: string; is_required: boolean; is_visible: boolean };

export const SECTION_TYPES = [
  { value: "cover", label: "Sampul" }, { value: "opening", label: "Pembuka" }, { value: "quote", label: "Kutipan" },
  { value: "couple", label: "Mempelai" }, { value: "event", label: "Acara" }, { value: "location", label: "Lokasi" },
  { value: "gallery", label: "Galeri" }, { value: "rsvp", label: "RSVP" }, { value: "gift", label: "Hadiah" },
  { value: "closing", label: "Penutup" },
];
export const typeLabel = (type: string) => SECTION_TYPES.find((item) => item.value === type)?.label ?? type;

/** First unused key for a type: "cover", then "cover-2", "cover-3"... */
export function suggestKey(type: string, taken: string[]): string {
  if (!taken.includes(type)) return type;
  let n = 2;
  while (taken.includes(`${type}-${n}`)) n += 1;
  return `${type}-${n}`;
}

const ALIGNMENTS = [{ value: "left", label: "Kiri" }, { value: "center", label: "Tengah" }, { value: "right", label: "Kanan" }];
const WEIGHTS = [300, 400, 500, 600, 700, 800].map((weight) => ({ value: String(weight), label: String(weight) }));
const IMAGE_POSITIONS = [{ value: "center", label: "Tengah" }, { value: "top", label: "Atas" }, { value: "bottom", label: "Bawah" }, { value: "left", label: "Kiri" }, { value: "right", label: "Kanan" }];

const PREVIEW_WIDTH = { mobile: 390, desktop: 1100 } as const;

/** Renders children at a fixed design width and scales the box down to fit, so the desktop view is honest about layout. */
function ScaledFrame({ width, children }: { width: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, height: 0 });
  useEffect(() => {
    const outerEl = outer.current;
    const innerEl = inner.current;
    if (!outerEl || !innerEl) return;
    const measure = () => {
      const scale = Math.min(1, outerEl.clientWidth / width);
      setBox({ scale, height: innerEl.offsetHeight * scale });
    };
    // ResizeObserver reports once as soon as it starts observing, so no separate first measurement is needed.
    const observer = new ResizeObserver(measure);
    observer.observe(outerEl);
    observer.observe(innerEl);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={outer} className="overflow-hidden" style={box.height ? { height: box.height } : undefined}>
      <div ref={inner} style={{ width, transform: `scale(${box.scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}

type Props = {
  draft: SectionDraft;
  setDraft: Dispatch<SetStateAction<SectionDraft>>;
  isNew: boolean;
  dirty: boolean;
  busy: boolean;
  error: string;
  existingKeys: string[];
  onSubmit: () => void;
  onReset: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export function ThemeSectionEditor({ draft, setDraft, isNew, dirty, busy, error, existingKeys, onSubmit, onReset, onDelete, onBack }: Props) {
  const [device, setDevice] = useState<keyof typeof PREVIEW_WIDTH>("mobile");
  const parsed = useMemo(() => parseContent(draft.default_content), [draft.default_content]);
  // While the JSON is mid-edit and invalid, keep showing the last valid content instead of a blank preview.
  const [lastValid, setLastValid] = useState<Record<string, unknown>>({});
  if (parsed.ok && parsed.value !== lastValid) setLastValid(parsed.value);

  const ctl: DesignControl = {
    design: parsed.ok ? readDesign(parsed.value) : {},
    set: (group, key, value) => setDraft((current) => ({ ...current, default_content: writeDesignValue(current.default_content, group, key, value) })),
    disabled: !parsed.ok,
  };
  const update = <K extends keyof SectionDraft>(key: K, value: SectionDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const background = (ctl.design.background ?? {}) as { type?: string };
  const duplicateKey = existingKeys.includes(draft.section_key);
  const canSave = !busy && parsed.ok && !duplicateKey && draft.section_key.length > 0 && (dirty || isNew);
  const jsonSize = parsed.ok ? JSON.stringify(parsed.value).length : null;

  function changeType(type: string) {
    setDraft((current) => {
      // A new section's key follows its type until the admin types their own.
      const followsType = isNew && (current.section_key === "" || current.section_key === suggestKey(current.section_type, existingKeys));
      return { ...current, section_type: type, section_key: followsType ? suggestKey(type, existingKeys) : current.section_key };
    });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) onSubmit();
  }
  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (canSave) onSubmit();
    }
  }

  return (
    <form onSubmit={submit} onKeyDown={onKeyDown} className="flex min-w-0 flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Kembali ke daftar section" onClick={onBack}><ArrowLeft aria-hidden="true" className="size-4" /></Button>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">{isNew ? "Section baru" : draft.section_key || "Section"}</h2>
            <p className="text-xs text-muted-foreground">{typeLabel(draft.section_type)}{dirty ? " · Perubahan belum disimpan" : ""}</p>
          </div>
        </div>
        {onDelete ? <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive-muted hover:text-destructive" disabled={busy} onClick={onDelete}><Trash2 aria-hidden="true" className="size-4" />Hapus</Button> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="section-type">Tipe section</Label>
          <Select value={draft.section_type} onValueChange={changeType}>
            <SelectTrigger id="section-type" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{SECTION_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="section-key">Section key</Label>
          <Input id="section-key" value={draft.section_key} onChange={(event) => update("section_key", event.target.value)} placeholder="contoh: cover" pattern="[a-z][a-z0-9_-]*" required maxLength={80} aria-invalid={duplicateKey || undefined} aria-describedby="section-key-hint" />
          <p id="section-key-hint" className={cn("text-xs", duplicateKey ? "text-destructive" : "text-muted-foreground")}>
            {duplicateKey ? "Key ini sudah dipakai section lain pada tema ini." : "Huruf kecil, angka, tanda hubung, atau garis bawah. Harus unik."}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
          <Label htmlFor="section-visible">Tampilkan section</Label>
          <Switch id="section-visible" checked={draft.is_visible} onCheckedChange={(value) => update("is_visible", value)} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
          <Label htmlFor="section-required">Section wajib</Label>
          <Switch id="section-required" checked={draft.is_required} onCheckedChange={(value) => update("is_required", value)} />
        </div>
      </div>

      {!parsed.ok ? (
        <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive-muted px-3 py-2 text-sm text-destructive">
          {parsed.error} Kontrol desain dinonaktifkan sampai JSON diperbaiki di tab JSON.
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="order-last min-w-0 xl:order-first">
          <Tabs defaultValue="background">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="background">Latar &amp; jarak</TabsTrigger>
              <TabsTrigger value="text">Teks</TabsTrigger>
              <TabsTrigger value="components">Tombol &amp; gambar</TabsTrigger>
              <TabsTrigger value="decoration">Dekorasi</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="background" className="space-y-5 pt-4">
              <DesignGroup title="Latar belakang" description="Kosongkan untuk memakai latar bawaan section.">
                <DesignSelectField ctl={ctl} group="background" name="type" label="Jenis" defaultLabel="Bawaan" options={[{ value: "color", label: "Warna" }, { value: "image", label: "Gambar" }, { value: "gradient", label: "Gradient" }]} />
                {background.type === "color" ? <DesignColorField ctl={ctl} group="background" name="value" label="Warna latar" placeholder="#f8f4ef" /> : null}
                {background.type === "image" ? <DesignTextField ctl={ctl} group="background" name="value" label="URL gambar" placeholder="https://..." maxLength={2048} /> : null}
                {background.type === "gradient" ? <DesignTextField ctl={ctl} group="background" name="value" label="Gradient" placeholder="linear-gradient(180deg, #fff, #eee)" maxLength={2048} hint="Format: linear-gradient(sudut, warna, warna)." /> : null}
                {background.type === "image" ? <>
                  <DesignSelectField ctl={ctl} group="background" name="position" label="Posisi gambar" options={IMAGE_POSITIONS} />
                  <DesignSelectField ctl={ctl} group="background" name="size" label="Ukuran gambar" options={[{ value: "cover", label: "Cover" }, { value: "contain", label: "Contain" }, { value: "auto", label: "Auto" }]} />
                  <DesignRangeField ctl={ctl} group="background" name="overlay" label="Overlay gelap" min={0} max={1} step={0.05} className="sm:col-span-2" hint="Menggelapkan gambar agar teks tetap terbaca." />
                </> : null}
              </DesignGroup>
              <DesignGroup title="Jarak section">
                <DesignNumberField ctl={ctl} group="layout" name="paddingTop" label="Padding atas" unit="px" min={0} max={400} />
                <DesignNumberField ctl={ctl} group="layout" name="paddingBottom" label="Padding bawah" unit="px" min={0} max={400} />
              </DesignGroup>
            </TabsContent>

            <TabsContent value="text" className="space-y-5 pt-4">
              <DesignGroup title="Heading">
                <DesignTextField ctl={ctl} group="typography" name="headingFontFamily" label="Font" placeholder="Georgia, serif" />
                <DesignNumberField ctl={ctl} group="typography" name="headingFontSize" label="Ukuran" unit="px" min={12} max={120} />
                <DesignColorField ctl={ctl} group="typography" name="headingColor" label="Warna" placeholder="#2b2927" />
                <DesignSelectField ctl={ctl} group="typography" name="headingAlignment" label="Perataan" options={ALIGNMENTS} />
              </DesignGroup>
              <DesignGroup title="Isi teks">
                <DesignTextField ctl={ctl} group="typography" name="bodyFontFamily" label="Font" placeholder="Arial, sans-serif" />
                <DesignNumberField ctl={ctl} group="typography" name="bodyFontSize" label="Ukuran" unit="px" min={8} max={48} />
                <DesignColorField ctl={ctl} group="typography" name="bodyColor" label="Warna" placeholder="#5b5550" />
                <DesignSelectField ctl={ctl} group="typography" name="bodyAlignment" label="Perataan" options={ALIGNMENTS} />
              </DesignGroup>
              <DesignGroup title="Semua teks" description="Dipakai untuk teks yang tidak diatur di heading atau isi teks.">
                <DesignTextField ctl={ctl} group="typography" name="fontFamily" label="Font" placeholder="Georgia, serif" />
                <DesignColorField ctl={ctl} group="typography" name="color" label="Warna" placeholder="#2b2927" />
                <DesignSelectField ctl={ctl} group="typography" name="fontWeight" label="Ketebalan" options={WEIGHTS} />
                <DesignSelectField ctl={ctl} group="typography" name="alignment" label="Perataan" options={ALIGNMENTS} />
              </DesignGroup>
            </TabsContent>

            <TabsContent value="components" className="space-y-5 pt-4">
              <DesignGroup title="Tombol dan tautan" description="Berlaku untuk tombol aksi di dalam section ini.">
                <DesignColorField ctl={ctl} group="button" name="backgroundColor" label="Latar tombol" placeholder="#6b5144" />
                <DesignColorField ctl={ctl} group="button" name="textColor" label="Teks tombol" placeholder="#ffffff" />
                <DesignColorField ctl={ctl} group="button" name="borderColor" label="Border tombol" placeholder="#6b5144" />
                <DesignNumberField ctl={ctl} group="button" name="borderRadius" label="Radius" unit="px" min={0} max={48} />
                <DesignNumberField ctl={ctl} group="button" name="fontSize" label="Ukuran teks" unit="px" min={10} max={32} />
                <DesignNumberField ctl={ctl} group="button" name="paddingX" label="Padding horizontal" unit="px" min={0} max={64} />
                <DesignNumberField ctl={ctl} group="button" name="paddingY" label="Padding vertikal" unit="px" min={0} max={40} />
              </DesignGroup>
              <DesignGroup title="Gambar" description="Terutama memengaruhi gambar pada section galeri.">
                <DesignSelectField ctl={ctl} group="image" name="aspectRatio" label="Rasio" options={[{ value: "square", label: "Persegi (1:1)" }, { value: "portrait", label: "Portrait (3:4)" }, { value: "landscape", label: "Landscape (4:3)" }]} />
                <DesignSelectField ctl={ctl} group="image" name="objectFit" label="Object fit" options={[{ value: "cover", label: "Cover" }, { value: "contain", label: "Contain" }]} />
                <DesignSelectField ctl={ctl} group="image" name="objectPosition" label="Posisi" options={IMAGE_POSITIONS} />
                <DesignNumberField ctl={ctl} group="image" name="borderRadius" label="Radius" unit="px" min={0} max={48} />
              </DesignGroup>
            </TabsContent>

            <TabsContent value="decoration" className="pt-4">
              <fieldset disabled={!parsed.ok} className="min-w-0 [&>section]:border-t-0 [&>section]:pt-0">
                <ThemeDecorationControls value={draft.default_content} onChange={(value) => update("default_content", value)} />
              </fieldset>
            </TabsContent>

            <TabsContent value="json" className="space-y-2 pt-4">
              <Label htmlFor="section-content">Konten default (JSON)</Label>
              <Textarea id="section-content" value={draft.default_content} onChange={(event) => update("default_content", event.target.value)} rows={14} className="font-mono text-xs" spellCheck={false} aria-invalid={!parsed.ok || undefined} aria-describedby="section-content-hint" />
              <p id="section-content-hint" className={cn("text-xs", jsonSize !== null && jsonSize > 65536 ? "text-destructive" : "text-muted-foreground")}>
                {jsonSize === null ? "JSON belum valid." : `${(jsonSize / 1024).toFixed(1)} KB dari maksimal 64 KB.`} Struktur field mengikuti renderer section terkait.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <aside aria-label="Pratinjau section" className="order-first min-w-0 space-y-3 xl:order-last xl:sticky xl:top-4 xl:self-start">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Pratinjau</h3>
            <div role="group" aria-label="Ukuran pratinjau" className="flex gap-1">
              <Button type="button" size="sm" variant={device === "mobile" ? "default" : "outline"} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><Smartphone aria-hidden="true" className="size-4" />Mobile</Button>
              <Button type="button" size="sm" variant={device === "desktop" ? "default" : "outline"} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Monitor aria-hidden="true" className="size-4" />Desktop</Button>
            </div>
          </div>
          <div className="max-h-[28rem] overflow-y-auto rounded-lg border bg-background xl:max-h-[calc(100vh-14rem)]">
            <ScaledFrame width={PREVIEW_WIDTH[device]}>
              <ThemeSectionLivePreview sectionKey={draft.section_key || "preview"} sectionType={draft.section_type} content={lastValid} visible={draft.is_visible} />
            </ScaledFrame>
          </div>
          <p className="text-xs text-muted-foreground">Memakai renderer section asli dengan data contoh.{device === "desktop" ? " Tampilan desktop diperkecil agar muat." : ""}</p>
        </aside>
      </div>

      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t bg-card/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
        <p className="text-xs text-muted-foreground">{dirty ? "Ada perubahan yang belum disimpan." : isNew ? "Section belum disimpan." : "Semua perubahan tersimpan."}</p>
        <div className="flex gap-2">
          {!isNew ? <Button type="button" variant="outline" disabled={busy || !dirty} onClick={onReset}><RotateCcw aria-hidden="true" className="size-4" />Kembalikan</Button> : null}
          <Button type="submit" disabled={!canSave}>{busy ? <><Loader2Icon aria-hidden="true" className="size-4 animate-spin" />Menyimpan...</> : <><Save aria-hidden="true" className="size-4" />{isNew ? "Buat section" : "Simpan section"}</>}</Button>
        </div>
      </div>
    </form>
  );
}
