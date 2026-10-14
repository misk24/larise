"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon, Share2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PublicUrlActions({ slug }: { slug: string }) {
  const [isCopying, setIsCopying] = useState(false);
  const publicUrl = typeof window === "undefined" ? "" : `${window.location.origin}/undangan/${slug}`;

  async function copyUrl() {
    setIsCopying(true);
    try {
      const url = publicUrl || `${window.location.origin}/undangan/${slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Tautan undangan berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin tautan. Periksa izin clipboard browser.");
    } finally {
      setIsCopying(false);
    }
  }

  async function shareUrl() {
    const url = publicUrl || `${window.location.origin}/undangan/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Undangan pernikahan", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Browser belum mendukung berbagi langsung. Tautan disalin.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Tautan tidak dapat dibagikan. Coba salin tautan.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" onClick={copyUrl} disabled={isCopying}>
        <CopyIcon className="mr-2 size-3.5" />
        Salin tautan
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={shareUrl}>
        <Share2Icon className="mr-2 size-3.5" />
        Bagikan
      </Button>
    </div>
  );
}
