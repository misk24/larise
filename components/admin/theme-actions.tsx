"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ThemeActions({ id, active, name }: { id: string; active: boolean; name: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function toggle() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/themes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !active }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal mengubah status tema");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Terjadi kesalahan"); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm(`Hapus tema "${name}"? Tema yang digunakan undangan akan ditolak oleh server.`)) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/themes/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menghapus tema");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Terjadi kesalahan"); }
    finally { setBusy(false); }
  }

  return <div className="flex flex-wrap items-center gap-2">
    <Button size="sm" variant="outline" disabled={busy} onClick={toggle}>{busy ? "Memproses..." : active ? "Nonaktifkan" : "Aktifkan"}</Button>
    <Button size="sm" variant="destructive" disabled={busy} onClick={remove}>Hapus</Button>
    {message ? <p role="alert" className="w-full text-xs text-destructive">{message}</p> : null}
  </div>;
}
