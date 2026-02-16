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

type Props = {
  id: string;
};

const SECTION_TYPES = [
  "cover",
  "hero",
  "quote",
  "event",
  "countdown",
  "story",
  "gallery",
  "gift",
  "rsvp",
  "wish",
  "closing",
  "footer",
];

export default function SectionForm({ id }: Props) {
  const router = useRouter();
  const [sectionKey, setSectionKey] = useState("");
  const [sectionType, setSectionType] = useState("cover");
  const [defaultContent, setDefaultContent] = useState("{}");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/themes/${id}/sections`, {
      method: "POST",
      body: JSON.stringify({
        section_key: sectionKey,
        section_type: sectionType,
        default_content: JSON.parse(defaultContent),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to create section");
      setLoading(false);
      return;
    }

    setSectionKey("");
    setDefaultContent("{}");

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <div className="font-semibold">Add Section</div>

      <Input
        placeholder="section_key (e.g. hero, event)"
        value={sectionKey}
        onChange={(e) => setSectionKey(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <Select value={sectionType} onValueChange={setSectionType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih section type" />
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
        className="border p-2 w-full font-mono text-sm"
      />

      <Button disabled={loading}>
        {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        {loading ? "Saving..." : "Add Section"}
      </Button>
    </form>
  );
}
