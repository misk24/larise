"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { saveInvitationSections } from "@/lib/actions/invitation-builder";
import { setInvitationPublished } from "@/lib/actions/invitations";
import { SharedInvitationRenderer } from "@/components/invitation/shared-renderer";
import { InvitationMediaUploader } from "@/components/dashboard/invitation-media-uploader";
import type { Invitation, InvitationMedia, InvitationSection, Theme, Wish } from "@/types/database";
import { ChevronDown, Eye, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";

type BuilderInvitation = Invitation & { themes?: Theme | null };

const labels: Record<string, string> = {
  cover: "Cover",
  opening: "Pembuka",
  couple: "Mempelai",
  quote: "Kutipan",
  event: "Acara",
  gallery: "Galeri",
  location: "Lokasi",
  closing: "Penutup",
  rsvp: "RSVP",
  wishes: "Ucapan",
  gift: "Hadiah",
};

const fixedSectionTypes = new Set(["cover", "opening", "closing"]);
const sectionOrder = ["cover", "opening", "quote", "couple", "event", "location", "gallery", "rsvp", "wishes", "gift", "closing"];

function normalizeSectionOrder(items: InvitationSection[], sortMovable = false) {
  const fixedStart = [
    ...items.filter((item) => item.section_type === "cover"),
    ...items.filter((item) => item.section_type === "opening"),
  ];
  const fixedEnd = items.filter((item) => item.section_type === "closing");
  const movable = items.filter((item) => !fixedSectionTypes.has(item.section_type));
  if (sortMovable) {
    movable.sort((a, b) => {
      const aOrder = sectionOrder.indexOf(a.section_type);
      const bOrder = sectionOrder.indexOf(b.section_type);
      if (aOrder >= 0 && bOrder >= 0 && aOrder !== bOrder) return aOrder - bOrder;
      return a.position - b.position;
    });
  }
  return [...fixedStart, ...movable, ...fixedEnd].map((item, position) => ({ ...item, position }));
}

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
    { key: "date", label: "Tanggal", type: "date" },
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
  media,
}: {
  invitation: BuilderInvitation;
  initialSections: InvitationSection[];
  wishes: Wish[];
  media: InvitationMedia[];
}) {
  const [sections, setSections] = useState(() => normalizeSectionOrder([...initialSections].sort((a, b) => a.position - b.position), true));
  const [expandedId, setExpandedId] = useState(initialSections[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<"sections" | "preview">("sections");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"saved" | "dirty" | "saving">("saved");
  const [published, setPublished] = useState(invitation.is_published);
  const [isPublishing, setIsPublishing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changeVersion = useRef(0);

  function persist(nextSections: InvitationSection[]) {
    const version = ++changeVersion.current;
    setStatus("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setStatus("saving");
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
      if (version !== changeVersion.current) return;
      if (result.error) {
        setStatus("dirty");
        toast.error(result.error);
        return;
      }
      setStatus("saved");
    }, 800);
  }

  function applySections(nextSections: InvitationSection[]) {
    const normalized = nextSections.map((section, index) => ({ ...section, position: index }));
    setSections(normalized);
    persist(normalized);
  }

  function reorderSections(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const from = sections.findIndex((section) => section.id === sourceId);
    const to = sections.findIndex((section) => section.id === targetId);
    if (from < 0 || to < 0) return;
    if (fixedSectionTypes.has(sections[from].section_type) || fixedSectionTypes.has(sections[to].section_type)) return;
    const movable = sections.filter((section) => !fixedSectionTypes.has(section.section_type));
    const sourceIndex = movable.findIndex((section) => section.id === sourceId);
    const targetIndex = movable.findIndex((section) => section.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = movable.splice(sourceIndex, 1);
    movable.splice(targetIndex, 0, moved);
    applySections(normalizeSectionOrder([...sections.filter((section) => fixedSectionTypes.has(section.section_type)), ...movable]));
  }

  function toggleVisibility(section: InvitationSection, isVisible: boolean) {
    applySections(sections.map((item) => item.id === section.id ? { ...item, is_visible: isVisible } : item));
  }

  function updateSelected(next: InvitationSection) {
    const nextSections = sections.map((item) => item.id === next.id ? next : item);
    setSections(nextSections);
    persist(nextSections);
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
    if (isPublishing) return;
    if (status !== "saved") {
      toast.error("Tunggu sampai perubahan selesai tersimpan sebelum publish.");
      return;
    }
    const next = !published;
    setIsPublishing(true);
    try {
      const result = await setInvitationPublished(invitation.id, next);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setPublished(next);
      toast.success(next ? "Undangan dipublish." : "Undangan di-unpublish.");
    } finally {
      setIsPublishing(false);
    }
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
        <Button onClick={togglePublish} disabled={isPublishing || status !== "saved"} variant={published ? "outline" : "default"}>
          {isPublishing && <Loader2 className="size-4 animate-spin" />}
          {published ? "Unpublish" : "Publish"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg border bg-muted p-1">
        {([
          ["sections", "Sections"],
          ["preview", "Preview"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            aria-pressed={activeTab === value}
            className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {value === "sections" ? <GripVertical className="size-4" /> : <Eye className="size-4" />}
            {label}
          </button>
        ))}
      </div>

      {activeTab === "sections" ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sections</CardTitle>
            <CardDescription>Atur urutan dan edit konten langsung di setiap bagian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.length ? sections.map((section, index) => {
              const expanded = expandedId === section.id;
              const fields = fieldConfig[section.section_type] ?? [];
              return (
                <motion.div
                  key={section.id}
                  layout
                  transition={{ layout: { type: "spring", stiffness: 420, damping: 34 } }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedId) reorderSections(draggedId, section.id);
                    setDraggedId(null);
                  }}
                  className={`overflow-hidden rounded-lg border bg-background transition-colors ${draggedId === section.id ? "border-primary/60 opacity-60" : "border-border"}`}
                >
                  <div className="flex items-center gap-2 p-3">
                    {fixedSectionTypes.has(section.section_type) ? (
                      <span className="flex size-9 shrink-0 items-center justify-center text-muted-foreground" title="Posisi section dikunci">
                        <GripVertical className="size-4 opacity-30" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", section.id);
                          setDraggedId(section.id);
                        }}
                        onDragEnd={() => setDraggedId(null)}
                        onKeyDown={(event) => {
                          if (event.altKey && event.key === "ArrowUp") {
                            event.preventDefault();
                            const target = sections.slice(0, index).reverse().find((item) => !fixedSectionTypes.has(item.section_type));
                            if (target) reorderSections(section.id, target.id);
                          }
                          if (event.altKey && event.key === "ArrowDown") {
                            event.preventDefault();
                            const target = sections.slice(index + 1).find((item) => !fixedSectionTypes.has(item.section_type));
                            if (target) reorderSections(section.id, target.id);
                          }
                        }}
                        aria-label={`Pindahkan ${labels[section.section_type] ?? section.section_key}. Gunakan Alt plus panah atas atau bawah untuk mengurutkan dengan keyboard.`}
                        title="Drag untuk mengurutkan. Alt + ↑/↓ untuk keyboard."
                        className="flex size-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                      >
                        <GripVertical className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setExpandedId(expanded ? "" : section.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs tabular-nums text-muted-foreground">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{labels[section.section_type] ?? section.section_key}</span>
                        <span className="block text-xs text-muted-foreground">{section.is_visible ? "Tampil di undangan" : "Disembunyikan"}</span>
                      </span>
                      <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="section-editor"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 border-t px-4 pb-4 pt-4">
                          <div className="flex items-center justify-between gap-3 rounded-md bg-muted/50 px-3 py-2.5">
                            <div className="space-y-0.5">
                              <Label htmlFor={`section-${section.id}-visibility`} className="text-sm font-medium">Tampilkan section</Label>
                              <p className="text-xs text-muted-foreground">{section.is_visible ? "Section tampil di undangan." : "Section disembunyikan dari undangan."}</p>
                            </div>
                            <Switch
                              id={`section-${section.id}-visibility`}
                              checked={section.is_visible}
                              onCheckedChange={(checked) => toggleVisibility(section, checked)}
                              aria-label={`Tampilkan ${labels[section.section_type] ?? section.section_key}`}
                            />
                          </div>
                          {section.section_type === "gallery" ? (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor={`section-${section.id}-title`}>Judul</Label>
                                <Input
                                  id={`section-${section.id}-title`}
                                  value={displayValue(section, "title")}
                                  onChange={(event) => updateSelected(updateContent(section, "title", event.target.value))}
                                />
                              </div>
                              <InvitationMediaUploader
                                invitationId={invitation.id}
                                initialMedia={media}
                                onChange={(nextMedia) => {
                                  const urls = nextMedia
                                    .map((item) => (item as InvitationMedia & { public_url?: string }).public_url ?? "")
                                    .filter(Boolean);
                                  updateSelected({ ...section, content: { ...section.content, images: urls } });
                                }}
                              />
                            </>
                          ) : section.section_type === "rsvp" || section.section_type === "wishes" ? (
                            <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                              Section ini tidak punya field konten. Pengaturan RSVP dan ucapan dikelola dari data guest/public flow.
                            </p>
                          ) : fields.length ? (
                            <div className="space-y-4">
                              {fields.map((field) => (
                                <div className="space-y-2" key={field.key}>
                                  <Label htmlFor={`section-${section.id}-${field.key}`}>{field.label}</Label>
                                  {field.multiline ? (
                                    <Textarea
                                      id={`section-${section.id}-${field.key}`}
                                      value={displayValue(section, field.key)}
                                      onChange={(event) => updateSelected(updateContent(section, field.key, event.target.value))}
                                      rows={field.key === "body" || field.key === "images" ? 6 : 4}
                                    />
                                  ) : (
                                    <Input
                                      id={`section-${section.id}-${field.key}`}
                                      type={field.type ?? "text"}
                                      value={displayValue(section, field.key)}
                                      onChange={(event) => updateSelected(updateContent(section, field.key, event.target.value))}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                              Belum ada field editor untuk section ini.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }) : (
              <p className="rounded-md bg-muted p-6 text-center text-sm text-muted-foreground">Belum ada section untuk undangan ini.</p>
            )}
            <p className="border-t pt-4 text-xs text-muted-foreground">
              Perubahan tersimpan otomatis. Drag untuk mengurutkan section; Cover, Opening, dan Closing terkunci posisinya.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>Renderer yang sama dengan halaman publik.</CardDescription>
          </CardHeader>
          <div className="bg-muted/30 p-2 md:p-4">
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
      )}
    </div>
  );
}
