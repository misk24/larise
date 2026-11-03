"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ThemeActions({ id, active, name }: { id: string; active: boolean; name: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function toggleStatus() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/themes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !active }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Status tema gagal diperbarui.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteTheme() {
    if (!window.confirm(`Hapus tema "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/themes/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tema gagal dihapus.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={toggleStatus}>
        {busy ? "Memproses..." : active ? "Nonaktifkan" : "Aktifkan"}
      </Button>
      <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={deleteTheme}>
        Hapus
      </Button>
      {message ? <p role="alert" className="absolute left-0 top-full mt-1 w-56 whitespace-normal text-xs text-destructive">{message}</p> : null}
    </div>
  );
}
