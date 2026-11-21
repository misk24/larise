"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, LayoutTemplate, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { BackendEmptyState, BackendErrorState } from "@/components/backend/backend-ui";
import { ConfirmDialog } from "@/components/backend/confirm-dialog";
import { ThemeDesignInspector } from "@/components/admin/theme-design-inspector";
import { ThemeSectionLivePreview } from "@/components/admin/theme-section-live-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SECTION_TYPES, STARTER_SECTION_TYPES, nextSectionKey, parseContent, sectionTypeLabel, type SectionContent } from "@/lib/theme-design-fields";

type Section = {
  id: string;
  section_key: string;
  section_type: string;
  position: number;
  default_content: SectionContent;
  is_required: boolean;
  is_visible: boolean;
};

type Draft = {
  section_key: string;
  section_type: string;
  content: SectionContent;
  json: string;
  jsonError: string;
  is_required: boolean;
  is_visible: boolean;
};

type Target = { id: string } | { type: string };

const stringify = (content: SectionContent) => JSON.stringify(content, null, 2);
const draftFromSection = (section: Section): Draft => ({
  section_key: section.section_key,
  section_type: section.section_type,
  content: section.default_content ?? {},
  json: stringify(section.default_content ?? {}),
  jsonError: "",
  is_required: section.is_required,
  is_visible: section.is_visible,
});
const draftFromType = (type: string, keys: string[]): Draft => ({
  section_key: nextSectionKey(type, keys),
  section_type: type,
  content: {},
  json: "{}",
  jsonError: "",
  is_required: false,
  is_visible: true,
});
const snapshot = (draft: Draft) =>
  JSON.stringify([draft.section_key, draft.section_type, draft.content, draft.is_required, draft.is_visible]);

export default function ThemeSectionsBuilder({ themeId, initialSections }: { themeId: string; initialSections: Section[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(initialSections[0]?.id ?? null);
  const [draft, setDraft] = useState<Draft | null>(initialSections[0] ? draftFromSection(initialSections[0]) : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("mobile");
  const [pane, setPane] = useState<"preview" | "edit">("edit");
  const [pending, setPending] = useState<Target | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const base = `/api/admin/themes/${themeId}/sections`;
  // Tombol yang sedang fokus bisa hilang dari DOM (hapus, set standar). Kembalikan fokus ke section terpilih.
  const focusSelected = () => requestAnimationFrame(() => listRef.current?.querySelector<HTMLElement>("button[aria-current]")?.focus());

  const saved = selectedId && selectedId !== "new" ? sections.find((item) => item.id === selectedId) : undefined;
  const dirty = !!draft && (selectedId === "new" || !saved || snapshot(draftFromSection(saved)) !== snapshot(draft));

  function open(target: Target) {
    setError("");
    if ("id" in target) {
      const section = sections.find((item) => item.id === target.id);
      if (!section) return;
      setSelectedId(section.id);
      setDraft(draftFromSection(section));
    } else {
      setSelectedId("new");
      setDraft(draftFromType(target.type, sections.map((item) => item.section_key)));
    }
    setPane("edit");
  }
  const select = (target: Target) => {
    if (dirty && !("id" in target && target.id === selectedId)) setPending(target);
    else open(target);
  };

  const patch = (changes: Partial<Draft>) => {
    setJustSaved(false);
    setDraft((current) => (current ? { ...current, ...changes } : current));
  };
  const setContent = (content: SectionContent) => patch({ content, json: stringify(content), jsonError: "" });
  function setJson(json: string) {
    const content = parseContent(json);
    if (content) patch({ json, content, jsonError: "" });
    else patch({ json, jsonError: "Konten harus berupa objek JSON yang valid. Pratinjau memakai versi valid terakhir." });
  }

  async function request(url: string, init: RequestInit, fallback: string) {
    const response = await fetch(url, init);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || fallback);
    return result;
  }
  const messageOf = (cause: unknown) => (cause instanceof Error ? cause.message : "Terjadi kesalahan.");

  async function save() {
    if (!draft || draft.jsonError) return;
    setBusy(true);
    setError("");
    try {
      const creating = selectedId === "new";
      const result: Section = await request(
        creating ? base : `${base}/${selectedId}`,
        {
          method: creating ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_key: draft.section_key,
            section_type: draft.section_type,
            default_content: draft.content,
            is_required: draft.is_required,
            is_visible: draft.is_visible,
          }),
        },
        "Section gagal disimpan.",
      );
      setSections((current) => (creating ? [...current, result] : current.map((item) => (item.id === result.id ? result : item))).sort((a, b) => a.position - b.position));
      setSelectedId(result.id);
      setDraft(draftFromSection(result));
      setJustSaved(true);
      setAnnouncement(creating ? "Section baru disimpan." : "Section disimpan.");
      router.refresh();
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setBusy(false);
    }
  }

  /** Membuat set section standar satu per satu agar urutan posisi dari server tetap benar. */
  async function seedStarter() {
    if (sections.length || busy) return;
    setBusy(true);
    setError("");
    const created: Section[] = [];
    try {
      for (const type of STARTER_SECTION_TYPES) {
        const result: Section = await request(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section_key: type, section_type: type, default_content: {}, is_required: false, is_visible: true }),
        }, "Set section standar gagal dibuat.");
        created.push(result);
      }
    } catch (cause) {
      setError(created.length ? `${messageOf(cause)} ${created.length} dari ${STARTER_SECTION_TYPES.length} section sudah dibuat.` : messageOf(cause));
    } finally {
      if (created.length) {
        setSections(created);
        setSelectedId(created[0].id);
        setDraft(draftFromSection(created[0]));
        setAnnouncement(`${created.length} section standar dibuat.`);
        focusSelected();
        router.refresh();
      }
      setBusy(false);
    }
  }

  async function remove() {
    if (!saved) return;
    setBusy(true);
    setError("");
    try {
      await request(`${base}/${saved.id}`, { method: "DELETE" }, "Section gagal dihapus.");
      const index = sections.findIndex((item) => item.id === saved.id);
      const rest = sections.filter((item) => item.id !== saved.id);
      const next = rest[Math.min(index, rest.length - 1)];
      setSections(rest);
      setSelectedId(next?.id ?? null);
      setDraft(next ? draftFromSection(next) : null);
      setAnnouncement(`Section "${saved.section_key}" dihapus.`);
      focusSelected();
      router.refresh();
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length || busy) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true);
    setError("");
    try {
      await request(`${base}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_ids: next.map((item) => item.id) }),
      }, "Urutan section gagal disimpan.");
      setSections(next.map((item, position) => ({ ...item, position })));
      setAnnouncement(`${sectionTypeLabel(next[target].section_type)} dipindah ke posisi ${target + 1} dari ${next.length}.`);
      router.refresh();
    } catch (cause) {
      setError(messageOf(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
      <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)_23rem] xl:items-start">
        <aside aria-label="Daftar section" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground"><span className="tabular-nums">{sections.length}</span> section, urut seperti di undangan</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm"><Plus aria-hidden="true" />Tambah</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {SECTION_TYPES.map((type) => (
                  <DropdownMenuItem key={type.value} onSelect={() => select({ type: type.value })} className="flex-col items-start gap-0.5">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {error && !draft ? <BackendErrorState title={error} /> : null}

          {sections.length || selectedId === "new" ? (
            <ol ref={listRef} className="space-y-1.5">
              {sections.map((section, index) => {
                const active = section.id === selectedId;
                return (
                  <li key={section.id} className={cn("flex items-center gap-1 rounded-lg border bg-card pr-1.5 transition-colors", active ? "border-primary/60 bg-accent/60" : "hover:border-primary/30")}>
                    <button type="button" onClick={() => select({ id: section.id })} aria-current={active ? "true" : undefined}
                      className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                      <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{sectionTypeLabel(section.section_type)}</span>
                        <span className="block truncate text-xs text-muted-foreground">{section.section_key}{section.is_required ? " · Wajib" : ""}</span>
                      </span>
                      {section.is_visible
                        ? <Eye aria-label="Tampil" className="size-4 shrink-0 text-muted-foreground" />
                        : <EyeOff aria-label="Disembunyikan" className="size-4 shrink-0 text-muted-foreground" />}
                    </button>
                    <div className="flex shrink-0">
                      <Button type="button" size="icon-sm" variant="ghost" aria-label={`Naikkan ${section.section_key}`} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUp aria-hidden="true" /></Button>
                      <Button type="button" size="icon-sm" variant="ghost" aria-label={`Turunkan ${section.section_key}`} disabled={busy || index === sections.length - 1} onClick={() => move(index, 1)}><ArrowDown aria-hidden="true" /></Button>
                    </div>
                  </li>
                );
              })}
              {selectedId === "new" && draft ? (
                <li className="flex items-center gap-2.5 rounded-lg border border-dashed border-primary/60 bg-accent/60 px-3 py-2.5">
                  <Plus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{sectionTypeLabel(draft.section_type)} (baru)</span>
                    <span className="block truncate text-xs text-muted-foreground">Belum disimpan</span>
                  </span>
                </li>
              ) : null}
            </ol>
          ) : (
            <BackendEmptyState icon={LayoutTemplate} title="Belum ada section" className="min-h-40"
              description="Mulai dari set standar (cover sampai penutup) lalu sesuaikan, atau tambahkan section satu per satu."
              action={
                <Button type="button" size="sm" onClick={seedStarter} disabled={busy}>
                  {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <LayoutTemplate aria-hidden="true" />}
                  {busy ? "Membuat section..." : "Gunakan set standar"}
                </Button>
              } />
          )}
        </aside>

        {draft ? (
          <>
            {/* Tombol, bukan tab: panel yang dikendalikan tidak berada di dalam satu komponen Tabs. */}
            <div className="grid grid-cols-2 gap-1 xl:hidden" role="group" aria-label="Tampilan panel">
              {(["edit", "preview"] as const).map((value) => (
                <Button key={value} type="button" variant={pane === value ? "default" : "outline"} aria-pressed={pane === value} onClick={() => setPane(value)}>
                  {value === "edit" ? "Edit" : "Pratinjau"}
                </Button>
              ))}
            </div>

            <section aria-label="Pratinjau section" className={cn("space-y-3 xl:sticky xl:top-4 xl:block", pane !== "preview" && "hidden xl:block")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Renderer asli dengan data contoh. Berubah saat Anda mengetik.</p>
                <div className="flex gap-1" role="group" aria-label="Ukuran pratinjau">
                  {(["mobile", "desktop"] as const).map((mode) => (
                    <Button key={mode} type="button" size="sm" variant={previewMode === mode ? "default" : "outline"} aria-pressed={previewMode === mode} onClick={() => setPreviewMode(mode)}>
                      {mode === "mobile" ? "Mobile" : "Desktop"}
                    </Button>
                  ))}
                </div>
              </div>
              <div role="region" aria-label="Area pratinjau" tabIndex={0} className="max-h-[calc(100vh-10rem)] overflow-auto rounded-xl border bg-muted/30 p-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <div className={previewMode === "mobile" ? "mx-auto w-[390px] max-w-full overflow-hidden rounded-xl border-4 border-border bg-background shadow-inner" : "w-full overflow-hidden rounded-md border bg-background"}>
                  <ThemeSectionLivePreview sectionKey={draft.section_key || "preview"} sectionType={draft.section_type} content={draft.content} visible={draft.is_visible} />
                </div>
              </div>
            </section>

            <section aria-label="Pengaturan section" className={cn("rounded-xl border bg-card xl:block", pane !== "edit" && "hidden xl:block")}>
              <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{selectedId === "new" ? "Section baru" : sectionTypeLabel(draft.section_type)}</h3>
                  <p className="truncate text-xs text-muted-foreground">{draft.section_key}</p>
                </div>
                {dirty ? <Badge variant="outline" className="shrink-0 border-warning/30 bg-warning-muted text-warning">Belum disimpan</Badge>
                  : justSaved ? <Badge variant="outline" className="shrink-0 border-success/30 bg-success-muted text-success">Tersimpan</Badge> : null}
              </div>

              <Tabs defaultValue="design" className="gap-0">
                <TabsList className="m-3 mb-0 w-[calc(100%-1.5rem)]">
                  <TabsTrigger value="design">Desain</TabsTrigger>
                  <TabsTrigger value="content">Konten</TabsTrigger>
                  <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="p-3 xl:max-h-[calc(100vh-18rem)] xl:overflow-y-auto">
                  <ThemeDesignInspector content={draft.content} onChange={setContent} />
                </TabsContent>

                <TabsContent value="content" className="space-y-2 p-3">
                  <Label htmlFor="section-content">Konten default (JSON)</Label>
                  <Textarea id="section-content" value={draft.json} onChange={(event) => setJson(event.target.value)} rows={16} spellCheck={false}
                    aria-invalid={!!draft.jsonError} aria-describedby="section-content-hint" className="font-mono text-xs" />
                  <p id="section-content-hint" className={cn("text-xs", draft.jsonError ? "text-destructive" : "text-muted-foreground")} role={draft.jsonError ? "alert" : undefined}>
                    {draft.jsonError || "Objek JSON maksimal 64 KB. Struktur field mengikuti renderer section. Pengaturan desain tersimpan di properti design."}
                  </p>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 p-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="section-type">Tipe section</Label>
                    <Select value={draft.section_type} onValueChange={(value) => patch({ section_type: value })}>
                      <SelectTrigger id="section-type" className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>{SECTION_TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="section-key">Section key</Label>
                    <Input id="section-key" value={draft.section_key} onChange={(event) => patch({ section_key: event.target.value })} pattern="[a-z][a-z0-9_\-]*" maxLength={80} required aria-describedby="section-key-hint" />
                    <p id="section-key-hint" className="text-xs text-muted-foreground">Huruf kecil, angka, tanda hubung, atau garis bawah. Harus unik di tema ini.</p>
                  </div>
                  <div className="space-y-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="section-visible">Tampilkan section</Label>
                      <Switch id="section-visible" checked={draft.is_visible} onCheckedChange={(value) => patch({ is_visible: value })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="section-required">Section wajib</Label>
                      <Switch id="section-required" checked={draft.is_required} onCheckedChange={(value) => patch({ is_required: value })} />
                    </div>
                  </div>
                  {saved ? (
                    <div className="space-y-2 border-t pt-4">
                      <p className="text-xs text-muted-foreground">Perubahan di sini mengubah template default, bukan konten undangan yang sudah dibuat.</p>
                      <ConfirmDialog title={`Hapus section "${saved.section_key}"?`} description="Data konten pada template ini akan ikut dihapus."
                        onConfirm={remove}
                        trigger={<Button type="button" variant="outline" size="sm" disabled={busy} className="text-destructive"><Trash2 aria-hidden="true" />Hapus section</Button>} />
                    </div>
                  ) : null}
                </TabsContent>
              </Tabs>

              <div className="sticky bottom-0 space-y-2 rounded-b-xl border-t bg-card p-3">
                {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={save} disabled={busy || !dirty || !!draft.jsonError || !draft.section_key}>
                    {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
                    {busy ? "Menyimpan..." : "Simpan section"}
                  </Button>
                  {dirty ? (
                    <Button type="button" variant="outline" disabled={busy} onClick={() => { setError(""); if (saved) setDraft(draftFromSection(saved)); else { setSelectedId(sections[0]?.id ?? null); setDraft(sections[0] ? draftFromSection(sections[0]) : null); } }}>
                      {saved ? "Batalkan perubahan" : "Batal"}
                    </Button>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <ConfirmDialog open={!!pending} onOpenChange={(value) => { if (!value) setPending(null); }}
        title="Buang perubahan?" description="Perubahan pada section ini belum disimpan dan akan hilang." confirmLabel="Buang perubahan"
        onConfirm={() => { if (pending) open(pending); setPending(null); }} />
    </div>
  );
}
