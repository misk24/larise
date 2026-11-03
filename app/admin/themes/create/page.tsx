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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tema gagal dibuat.");

      router.push(`/admin/themes/${result.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="backend-content space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Buat Tema</h1>
        <p className="mt-1 text-muted-foreground">Beri nama tema sebelum mengatur section undangan.</p>
      </div>

      <form onSubmit={handleSubmit} className="backend-surface w-full max-w-2xl space-y-5 p-4 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="theme-name" className="text-sm font-medium">Nama tema</label>
          <Input
            id="theme-name"
            placeholder="Contoh: Minimalis Modern"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            minLength={2}
            required
          />
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan dan Lanjutkan"}</Button>
      </form>
    </div>
  );
}
