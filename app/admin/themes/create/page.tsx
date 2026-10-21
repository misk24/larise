"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateThemePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/themes", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const theme = await res.json();
    router.push(`/admin/themes/${theme.id}`);
  }

  return (
    <div className="backend-content space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Buat Tema</h1>
        <p className="mt-1 text-muted-foreground">
          Beri nama tema sebelum mengatur section undangan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="backend-surface w-full max-w-2xl space-y-5 p-4 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="theme-name" className="text-sm font-medium">Nama tema</label>
          <Input
            id="theme-name"
            placeholder="Contoh: Minimalis Modern"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit">Simpan dan Lanjutkan</Button>
      </form>
    </div>
  );
}
