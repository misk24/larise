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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="text-2xl md:text-3xl font-medium">Create Theme</div>

      <Input
        placeholder="Theme name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <Button>Save & Continue</Button>
    </form>
  );
}
