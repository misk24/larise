import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ImageIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function GalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, gallery_images")
    .eq("user_id", user.id)
    .single();

  if (!invitation) {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-2xl md:text-3xl font-medium">Galeri Foto</span>
          <p className="text-muted-foreground">
            Kelola foto-foto untuk undangan Anda
          </p>
        </div>
        <Card className="border-border bg-sidebar">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Buat undangan terlebih dahulu untuk mengelola galeri.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">
          Galeri Foto
        </h1>
        <p className="text-muted-foreground">
          Kelola foto-foto untuk undangan Anda
        </p>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Fitur Upload Foto</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Fitur upload foto akan menggunakan Supabase Storage. Untuk saat ini,
            Anda dapat menambahkan URL foto melalui halaman edit undangan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
