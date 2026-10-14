"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateThemePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Tema gagal dibuat.");
      router.push("/admin/themes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Buat Tema</h1>
        <p className="text-sm text-muted-foreground">Tema baru dibuat dalam keadaan nonaktif sampai siap digunakan.</p>
      </div>
      <Input
        placeholder="Nama tema"
        aria-label="Nama tema"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        minLength={2}
        required
      />
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan tema"}</Button>
    </form>
  );
}
