import { WishesManager } from "@/components/dashboard/wishes-manager";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WishesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invitation) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold">Ucapan & Doa</h1>
          <p className="text-muted-foreground">Moderasi ucapan dari tamu undangan</p>
        </div>
        <Card className="border-border bg-sidebar">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Buat undangan terlebih dahulu untuk melihat ucapan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: wishes, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">Ucapan & Doa</h1>
        <p className="text-muted-foreground">Tampilkan atau sembunyikan ucapan, dan hapus spam.</p>
      </div>
      {error ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-sm text-destructive">
            Ucapan gagal dimuat. Coba muat ulang halaman.
          </CardContent>
        </Card>
      ) : (
        <WishesManager initialWishes={wishes ?? []} />
      )}
    </div>
  );
}
