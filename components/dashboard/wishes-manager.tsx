"use client";

import { deleteWish, setWishVisibility } from "@/lib/actions/wishes";
import type { Wish } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function WishesManager({ initialWishes }: { initialWishes: Wish[] }) {
  const [wishes, setWishes] = useState(initialWishes);
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  function toggleVisibility(wish: Wish) {
    setActiveId(wish.id);
    startTransition(async () => {
      const visibility = wish.visibility === "visible" ? "hidden" : "visible";
      const result = await setWishVisibility(wish.id, visibility);
      if (!result.success) {
        toast.error(result.error);
        setActiveId(null);
        return;
      }
      setWishes((current) => current.map((item) => item.id === wish.id ? { ...item, visibility } : item));
      toast.success(visibility === "visible" ? "Ucapan ditampilkan." : "Ucapan disembunyikan.");
      setActiveId(null);
    });
  }

  function removeWish(wish: Wish) {
    if (!window.confirm("Hapus ucapan ini secara permanen?")) return;
    setActiveId(wish.id);
    startTransition(async () => {
      const result = await deleteWish(wish.id);
      if (!result.success) {
        toast.error(result.error);
        setActiveId(null);
        return;
      }
      setWishes((current) => current.filter((item) => item.id !== wish.id));
      toast.success("Ucapan dihapus.");
      setActiveId(null);
    });
  }

  if (wishes.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Belum ada ucapan. Ucapan dari tamu akan muncul di sini.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wishes.map((wish) => (
        <Card key={wish.id} className="border-border/50">
          <CardContent className="flex h-full flex-col p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="font-semibold text-sm">{wish.guest_name}</p>
              <Badge variant={wish.visibility === "visible" ? "secondary" : "outline"}>
                {wish.visibility === "visible" ? "Ditampilkan" : "Disembunyikan"}
              </Badge>
            </div>
            <p className="mb-4 flex-1 whitespace-pre-wrap text-foreground">“{wish.message}”</p>
            <div className="mb-4 text-xs text-muted-foreground">
              {new Date(wish.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="flex-1" disabled={isPending} onClick={() => toggleVisibility(wish)}>
                {activeId === wish.id && isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : wish.visibility === "visible" ? <EyeOff className="mr-2 size-4" /> : <Eye className="mr-2 size-4" />}
                {wish.visibility === "visible" ? "Sembunyikan" : "Tampilkan"}
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Hapus ucapan" disabled={isPending} onClick={() => removeWish(wish)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
