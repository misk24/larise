"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
}

const SECTION_TYPES = [
  "cover",
  "opening",
  "quote",
  "couple",
  "event",
  "location",
  "gallery",
  "rsvp",
  "wishes",
  "gift",
  "closing",
];

export default function SectionForm({ id }: Props) {
  const router = useRouter();
  const [sectionKey, setSectionKey] = useState("");
  const [sectionType, setSectionType] = useState("cover");
  const [defaultContent, setDefaultContent] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(defaultContent);
    } catch {
      setError("Konten default harus berupa JSON yang valid.");
      return;
    }

    if (!parsedContent || typeof parsedContent !== "object" || Array.isArray(parsedContent)) {
      setError("Konten default harus berupa objek JSON, misalnya {}.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/themes/${id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_key: sectionKey,
          section_type: sectionType,
          default_content: parsedContent,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error ?? "Section gagal dibuat. Coba periksa data yang dimasukkan.");
        return;
      }

      setSectionKey("");
      setDefaultContent("{}");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded border p-4">
      <div className="font-semibold">Tambah Section</div>

      <Input
        placeholder="section_key (contoh: cover, event)"
        value={sectionKey}
        onChange={(e) => setSectionKey(e.target.value)}
        className="w-full border p-2"
        required
      />

      <Select value={sectionType} onValueChange={setSectionType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih tipe section" />
        </SelectTrigger>
        <SelectContent>
          {SECTION_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        value={defaultContent}
        onChange={(e) => setDefaultContent(e.target.value)}
        rows={6}
        className="w-full border p-2 font-mono text-sm"
        aria-invalid={Boolean(error)}
      />

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Button disabled={loading}>
        {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        {loading ? "Menyimpan..." : "Tambah Section"}
      </Button>
    </form>
  );
}
