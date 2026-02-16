import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { MessageSquareHeartIcon } from "lucide-react";
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
    .single();

  if (!invitation) {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-2xl md:text-3xl font-medium">Ucapan & Doa</span>
          <p className="text-muted-foreground">
            Lihat ucapan selamat dari tamu undangan
          </p>
        </div>
        <Card className="border-border bg-sidebar">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Buat undangan terlebih dahulu untuk melihat ucapan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: wishes } = await supabase
    .from("wishes")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">
          Ucapan & Doa
        </h1>
        <p className="text-muted-foreground">
          Lihat ucapan selamat dari tamu undangan
        </p>
      </div>
      {wishes && wishes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishes.map((wish) => (
            <Card key={wish.id} className="border-border/50">
              <CardContent className="p-4">
                <p className="text-foreground mb-4 italic">
                  &ldquo;{wish.message}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{wish.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(wish.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <MessageSquareHeartIcon className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Belum ada ucapan. Ucapan dari tamu akan muncul di sini.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
