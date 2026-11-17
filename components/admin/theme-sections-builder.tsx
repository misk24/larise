"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, LayoutTemplate, Plus } from "lucide-react";
import { toast } from "sonner";
import { BackendEmptyState, BackendErrorState } from "@/components/backend/backend-ui";
import { ConfirmDialog } from "@/components/backend/confirm-dialog";
import { Button } from "@/components/ui/button";
import { parseContent } from "@/components/admin/theme-design-fields";
import { ThemeSectionEditor, suggestKey, typeLabel, type SectionDraft } from "@/components/admin/theme-section-editor";
import { cn } from "@/lib/utils";

type Section = { id: string; section_key: string; section_type: string; position: number; default_content: Record<string, unknown>; is_required: boolean; is_visible: boolean };

const NEW = "new";
const toDraft = (section: Section): SectionDraft => ({
  section_key: section.section_key,
  section_type: section.section_type,
  default_content: JSON.stringify(section.default_content ?? {}, null, 2),
  is_required: section.is_required,
  is_visible: section.is_visible,
});
const blankDraft = (taken: string[]): SectionDraft => ({ section_key: suggestKey("cover", taken), section_type: "cover", default_content: "{}", is_required: false, is_visible: true });
const sameDraft = (a: SectionDraft, b: SectionDraft) => JSON.stringify(a) === JSON.stringify(b);
const json = { "Content-Type": "application/json" };

export default function ThemeSectionsBuilder({ themeId, initialSections }: { themeId: string; initialSections: Section[] }) {
  const router = useRouter();
  const first = initialSections[0];
  const initialDraft = first ? toDraft(first) : blankDraft([]);
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(first?.id ?? null);
  const [draft, setDraft] = useState<SectionDraft>(initialDraft);
  const [baseline, setBaseline] = useState<SectionDraft>(initialDraft);
  // Below lg the list and the editor share one column; this says which one is showing.
  const [mobileEditor, setMobileEditor] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listError, setListError] = useState("");
  const [editorError, setEditorError] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);
  const base = `/api/admin/themes/${themeId}/sections`;
  const isNew = selectedId === NEW;
  const dirty = !sameDraft(draft, baseline);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function load(id: string, next: SectionDraft) {
    setSelectedId(id); setDraft(next); setBaseline(next);
    setMobileEditor(true); setEditorError(""); setListError("");
  }
  function open(target: string) {
    if (target === NEW) return load(NEW, blankDraft(sections.map((item) => item.section_key)));
    const section = sections.find((item) => item.id === target);
    if (section) load(section.id, toDraft(section));
  }
  /** Opens a section, asking first when the current one has unsaved changes. */
  function request(target: string) {
    if (target === selectedId) { setMobileEditor(true); return; }
    if (dirty) setPending(target);
    else open(target);
  }

  async function save() {
    setEditorError("");
    const content = parseContent(draft.default_content);
    if (!content.ok) { setEditorError(content.error); return; }
    const editing = isNew ? null : selectedId;
    setBusy(true);
    try {
      const response = await fetch(editing ? `${base}/${editing}` : base, { method: editing ? "PATCH" : "POST", headers: json, body: JSON.stringify({ ...draft, default_content: content.value }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Section gagal disimpan.");
      if (editing) setSections((current) => current.map((item) => (item.id === editing ? result : item)));
      else setSections((current) => [...current, result].sort((a, b) => a.position - b.position));
      load(result.id, toDraft(result));
      toast.success(editing ? "Section disimpan." : "Section dibuat.");
      router.refresh();
    } catch (cause) {
      setEditorError(cause instanceof Error ? cause.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(section: Section) {
    setBusy(true); setListError("");
    try {
      const response = await fetch(`${base}/${section.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Section gagal dihapus.");
      const remaining = sections.filter((item) => item.id !== section.id);
      setSections(remaining);
      if (selectedId === section.id) {
        const next = remaining[0];
        if (next) load(next.id, toDraft(next)); else setSelectedId(null);
        setMobileEditor(false);
      }
      toast.success("Section dihapus.");
      router.refresh();
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length || busy) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true); setListError("");
    try {
      const response = await fetch(`${base}/reorder`, { method: "PATCH", headers: json, body: JSON.stringify({ section_ids: next.map((item) => item.id) }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Urutan section gagal disimpan.");
      setSections(next.map((item, position) => ({ ...item, position })));
      router.refresh();
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  /** Saves visibility straight from the list. It sends the saved content, so unsaved edits in the editor are untouched. */
  async function toggleVisible(section: Section) {
    if (busy) return;
    const visible = !section.is_visible;
    setBusy(true); setListError("");
    try {
      const response = await fetch(`${base}/${section.id}`, { method: "PATCH", headers: json, body: JSON.stringify({ section_key: section.section_key, section_type: section.section_type, default_content: section.default_content ?? {}, is_required: section.is_required, is_visible: visible }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Visibilitas section gagal disimpan.");
      setSections((current) => current.map((item) => (item.id === section.id ? { ...item, is_visible: visible } : item)));
      if (selectedId === section.id) {
        setDraft((current) => ({ ...current, is_visible: visible }));
        setBaseline((current) => ({ ...current, is_visible: visible }));
      }
      router.refresh();
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  const addButton = <Button type="button" size="sm" onClick={() => request(NEW)}><Plus aria-hidden="true" className="size-4" />Tambah section</Button>;
  if (!sections.length && !isNew) {
    return <BackendEmptyState icon={LayoutTemplate} title="Belum ada section" description="Tambahkan section pertama untuk membangun struktur tema." action={addButton} />;
  }
  const selected = sections.find((item) => item.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Struktur section</h2>
          <p className="text-sm text-muted-foreground">{sections.length} section · urutan sama dengan urutan tampil pada undangan</p>
        </div>
        {addButton}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className={cn("min-w-0 space-y-3", mobileEditor ? "hidden lg:block" : "block")}>
          {listError ? <BackendErrorState title={listError} /> : null}
          <ol className="space-y-2">
            {sections.map((section, index) => {
              const active = section.id === selectedId;
              return (
                <li key={section.id} className={cn("flex items-center gap-0.5 rounded-lg border bg-card pr-1.5 transition-colors", active ? "border-primary/40 bg-primary/5" : "hover:border-primary/30")}>
                  <button type="button" aria-current={active ? "true" : undefined} onClick={() => request(section.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-3 text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                    <span className={cn("min-w-0", !section.is_visible && "opacity-60")}>
                      <span className="block truncate text-sm font-medium">{section.section_key}</span>
                      <span className="block truncate text-xs text-muted-foreground">{typeLabel(section.section_type)}{section.is_required ? " · Wajib" : ""}{section.is_visible ? "" : " · Disembunyikan"}</span>
                    </span>
                  </button>
                  <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`${section.is_visible ? "Sembunyikan" : "Tampilkan"} ${section.section_key}`} aria-pressed={section.is_visible} disabled={busy} onClick={() => toggleVisible(section)}>
                    {section.is_visible ? <Eye aria-hidden="true" className="size-4" /> : <EyeOff aria-hidden="true" className="size-4" />}
                  </Button>
                  <div className="flex flex-col">
                    <Button type="button" size="icon" variant="ghost" className="size-5" aria-label={`Naikkan ${section.section_key}`} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUp aria-hidden="true" className="size-3.5" /></Button>
                    <Button type="button" size="icon" variant="ghost" className="size-5" aria-label={`Turunkan ${section.section_key}`} disabled={busy || index === sections.length - 1} onClick={() => move(index, 1)}><ArrowDown aria-hidden="true" className="size-3.5" /></Button>
                  </div>
                </li>
              );
            })}
            {isNew ? (
              <li className="flex items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <span className="w-5 shrink-0 text-center text-xs text-muted-foreground"><Plus aria-hidden="true" className="mx-auto size-3.5" /></span>
                <span className="text-sm font-medium">Section baru</span>
              </li>
            ) : null}
          </ol>
        </div>

        <div className={cn("min-w-0 rounded-xl border bg-card p-4 sm:p-5", mobileEditor ? "block" : "hidden lg:block")}>
          {selectedId ? (
            <ThemeSectionEditor
              draft={draft}
              setDraft={setDraft}
              isNew={isNew}
              dirty={dirty}
              busy={busy}
              error={editorError}
              existingKeys={sections.filter((item) => item.id !== selectedId).map((item) => item.section_key)}
              onSubmit={save}
              onReset={() => { setDraft(baseline); setEditorError(""); }}
              onDelete={selected ? () => setDeleteTarget(selected) : undefined}
              onBack={() => setMobileEditor(false)}
            />
          ) : (
            <BackendEmptyState icon={LayoutTemplate} title="Pilih section" description="Pilih section di daftar untuk mengatur desain dan melihat pratinjaunya." className="min-h-64 border-0" />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(isOpen) => { if (!isOpen) setPending(null); }}
        title="Buang perubahan?"
        description="Perubahan pada section ini belum disimpan dan akan hilang jika Anda pindah."
        confirmLabel="Buang perubahan"
        onConfirm={() => { if (pending) open(pending); setPending(null); }}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(isOpen) => { if (!isOpen) setDeleteTarget(null); }}
        title={`Hapus section "${deleteTarget?.section_key ?? ""}"?`}
        description="Section dan konten default-nya akan dihapus dari template tema ini. Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => { if (deleteTarget) void remove(deleteTarget); setDeleteTarget(null); }}
      />
    </div>
  );
}
