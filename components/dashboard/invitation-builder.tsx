"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveInvitationSections } from "@/lib/actions/invitation-builder";
import { setInvitationPublished } from "@/lib/actions/invitations";
import { SharedInvitationRenderer } from "@/components/invitation/shared-renderer";
import type { Invitation, InvitationSection, Theme, Wish } from "@/types/database";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type BuilderInvitation = Invitation & { themes?: Theme | null };

const labels: Record<string, string> = {
  cover: "Cover",
  opening: "Pembuka",
  couple: "Mempelai",
  quote: "Kutipan",
  event: "Acara",
  countdown: "Countdown",
  gallery: "Galeri",
  location: "Lokasi",
  closing: "Penutup",
  rsvp: "RSVP",
  wishes: "Ucapan",
  gift: "Hadiah",
};

const fieldConfig: Record<string, Array<{ key: string; label: string; multiline?: boolean; type?: string }>> = {
  cover: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Judul" },
    { key: "subtitle", label: "Subjudul", multiline: true },
  ],
  opening: [
    { key: "title", label: "Judul" },
    { key: "body", label: "Isi", multiline: true },
  ],
  couple: [
    { key: "title", label: "Judul" },
    { key: "groom_name", label: "Nama mempelai pria" },
    { key: "bride_name", label: "Nama mempelai wanita" },
    { key: "groom_parents", label: "Orang tua mempelai pria" },
    { key: "bride_parents", label: "Orang tua mempelai wanita" },
  ],
  quote: [
    { key: "quote", label: "Kutipan", multiline: true },
    { key: "author", label: "Sumber" },
  ],
  event: [
    { key: "title", label: "Judul" },
    { key: "date", label: "Tanggal" },
    { key: "time", label: "Waktu" },
    { key: "venue", label: "Tempat" },
    { key: "address", label: "Alamat", multiline: true },
  ],
  countdown: [
    { key: "title", label: "Judul" },
    { key: "target_date", label: "Target waktu", type: "datetime-local" },
  ],
  gallery: [
    { key: "title", label: "Judul" },
    { key: "images", label: "URL gambar, satu per baris", multiline: true },
  ],
  location: [
    { key: "title", label: "Judul" },
    { key: "venue", label: "Tempat" },
    { key: "address", label: "Alamat", multiline: true },
    { key: "maps_url", label: "URL Google Maps" },
  ],
  closing: [
    { key: "title", label: "Judul" },
    { key: "body", label: "Isi", multiline: true },
  ],
  gift: [
    { key: "bank_name", label: "Nama bank" },
    { key: "account_number", label: "Nomor rekening" },
    { key: "account_name", label: "Nama pemilik rekening" },
  ],
};

function displayValue(section: InvitationSection, key: string) {
  const value = section.content[key];
  if (key === "images" && Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") return value;
  return "";
}

function updateContent(section: InvitationSection, key: string, raw: string) {
  return {
    ...section,
    content: {
      ...section.content,
      [key]: key === "images" ? raw.split("\n").map((value) => value.trim()).filter(Boolean) : raw,
    },
  };
}

export function InvitationBuilder({
  invitation,
  initialSections,
  wishes,
}: {
  invitation: BuilderInvitation;
  initialSections: InvitationSection[];
  wishes: Wish[];
}) {
  const [sections, setSections] = useState(() => [...initialSections].sort((a, b) => a.position - b.position));
  const [selectedId, setSelectedId] = useState(initialSections[0]?.id ?? "");
  const [status, setStatus] = useState<"saved" | "dirty" | "saving">("saved");
  const [mobileView, setMobileView] = useState<"sections" | "editor" | "preview">("sections");
  const [published, setPublished] = useState(invitation.is_published);
  const [isPending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = useMemo(
    () => sections.find((section) => section.id === selectedId) ?? sections[0] ?? null,
    [sections, selectedId],
  );

  function persist(nextSections: InvitationSection[]) {
    setStatus("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setStatus("saving");
      startTransition(async () => {
        const result = await saveInvitationSections({
          invitationId: invitation.id,
          sections: nextSections.map(({ id, section_key, section_type, position, content, is_visible }) => ({
            id,
            section_key,
            section_type: section_type as never,
            position,
            content,
            is_visible,
          })),
        });
        if (result.error) {
          setStatus("dirty");
          toast.error(result.error);
          return;
        }
        setStatus("saved");
      });
    }, 800);
  }

  function applySections(nextSections: InvitationSection[]) {
    const normalized = nextSections.map((section, index) => ({ ...section, position: index }));
    setSections(normalized);
    persist(normalized);
  }

  function moveSelected(direction: -1 | 1) {
    if (!selected) return;
    const index = sections.findIndex((section) => section.id === selected.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    applySections(next);
  }

  function toggleVisibility(section: InvitationSection) {
    applySections(sections.map((item) => item.id === section.id ? { ...item, is_visible: !item.is_visible } : item));
  }

  function updateSelected(next: InvitationSection) {
    const nextSections = sections.map((item) => item.id === next.id ? next : item);
    setSections(nextSections);
    persist(nextSections);
  }

  function saveNow() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus("saving");
    startTransition(async () => {
      const result = await saveInvitationSections({
        invitationId: invitation.id,
        sections: sections.map(({ id, section_key, section_type, position, content, is_visible }) => ({
          id,
          section_key,
          section_type: section_type as never,
          position,
          content,
          is_visible,
        })),
      });
      if (result.error) {
        setStatus("dirty");
        toast.error(result.error);
        return;
      }
      setStatus("saved");
      toast.success("Perubahan tersimpan.");
    });
  }

  useEffect(() => {
    if (status === "saved") return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  async function togglePublish() {
    if (status !== "saved") {
      toast.error("Simpan perubahan terlebih dahulu sebelum publish.");
      saveNow();
      return;
    }
    const next = !published;
    const result = await setInvitationPublished(invitation.id, next);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setPublished(next);
    toast.success(next ? "Undangan dipublish." : "Undangan di-unpublish.");
  }

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-3">
        <div className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          <span className="text-muted-foreground">{published ? "Published" : "Draft"}</span>
          {status !== "saved" && <span className="ml-2 text-amber-600">• Belum tersimpan</span>}
        </div>
        <Button onClick={togglePublish} disabled={isPending || status === "saving"} variant={published ? "outline" : "default"}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {published ? "Unpublish" : "Publish"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted p-1 xl:hidden">
        {([["sections","Sections"],["editor","Editor"],["preview","Preview"]] as const).map(([value, label]) => (
          <button key={value} type="button" onClick={() => setMobileView(value)} className={`rounded-md px-3 py-2 text-sm font-medium ${mobileView === value ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(320px,420px)_minmax(360px,1fr)]">
      <Card className={`h-fit xl:sticky xl:top-4 ${mobileView === "sections" ? "block" : "hidden"} xl:block`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sections</CardTitle>
          <CardDescription>Urutkan dan pilih bagian undangan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setSelectedId(section.id)}
              className={`flex w-full items-center gap-2 rounded-md border p-2 text-left text-sm ${selected?.id === section.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
            >
              <GripVertical className="size-4 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{labels[section.section_type] ?? section.section_key}</span>
              {!section.is_visible && <EyeOff className="size-4 text-muted-foreground" />}
              <span className="text-xs text-muted-foreground">{index + 1}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className={`h-fit ${mobileView === "editor" ? "block" : "hidden"} xl:block`}>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{selected ? labels[selected.section_type] ?? selected.section_key : "Editor"}</CardTitle>
              <CardDescription>Konten terstruktur. Tidak perlu menyentuh HTML, karena manusia sudah cukup menderita.</CardDescription>
            </div>
            {selected && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleVisibility(selected)}
                aria-label={selected.is_visible ? "Sembunyikan section" : "Tampilkan section"}
              >
                {selected.is_visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selected ? (
            selected.section_type === "rsvp" || selected.section_type === "wishes" ? (
              <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                Section ini tidak punya field konten. Pengaturan RSVP dan ucapan dikelola dari data guest/public flow.
              </p>
            ) : (
              <div className="space-y-4">
                {(fieldConfig[selected.section_type] ?? []).map((field) => (
                  <div className="space-y-2" key={field.key}>
                    <Label htmlFor={`section-${selected.id}-${field.key}`}>{field.label}</Label>
                    {field.multiline ? (
                      <Textarea
                        id={`section-${selected.id}-${field.key}`}
                        value={displayValue(selected, field.key)}
                        onChange={(event) => updateSelected(updateContent(selected, field.key, event.target.value))}
                        rows={field.key === "body" || field.key === "images" ? 6 : 4}
                      />
                    ) : (
                      <Input
                        id={`section-${selected.id}-${field.key}`}
                        type={field.type ?? "text"}
                        value={displayValue(selected, field.key)}
                        onChange={(event) => updateSelected(updateContent(selected, field.key, event.target.value))}
                      />
                    )}
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => moveSelected(-1)} disabled={sections[0]?.id === selected.id}>
                    <ArrowUp className="size-4" />Naik
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => moveSelected(1)} disabled={sections[sections.length - 1]?.id === selected.id}>
                    <ArrowDown className="size-4" />Turun
                  </Button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada section.</p>
          )}
        </CardContent>
      </Card>

      <Card className={`overflow-hidden xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] ${mobileView === "preview" ? "block" : "hidden"} xl:block`}>
        <CardHeader className="flex-row items-center justify-between gap-3 border-b">
          <div>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>Renderer yang sama dengan halaman publik.</CardDescription>
          </div>
          <Button onClick={saveNow} disabled={isPending || status === "saved"} size="sm">
            {status === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {status === "saving" ? "Menyimpan..." : status === "dirty" ? "Simpan sekarang" : "Tersimpan"}
          </Button>
        </CardHeader>
        <div className="h-[calc(100%-81px)] overflow-auto bg-muted/30 p-2 md:p-4">
          <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
            <SharedInvitationRenderer
              invitation={invitation}
              sections={sections}
              guestName="Tamu Undangan"
              wishes={wishes}
            />
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
