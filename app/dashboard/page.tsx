import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRightIcon,
  EyeIcon,
  FileTextIcon,
  MessageSquareHeartIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invitations } = await supabase
    .from("invitations")
    // .select("*")
    .select("*, guests(count), wishes(count)")
    .eq("user_id", user?.id);

  const invitation = invitations?.[0];
  const totalGuests = invitation?.guests?.[0]?.count || 0;
  const totalWishes = invitation?.wishes?.[0]?.count || 0;

  const { data: rsvpStats } = invitation
    ? await supabase
        .from("rsvp")
        .select("status")
        .eq("invitation_id", invitation.id)
    : { data: [] };

  const confirmedGuests =
    rsvpStats?.filter((r) => r.status === "attending").length || 0;

  const stats = [
    {
      title: "Undangan Aktif",
      value: invitation ? 1 : 0,
      icon: FileTextIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Tamu",
      value: totalGuests,
      icon: UsersIcon,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Konfirmasi Hadir",
      value: confirmedGuests,
      icon: EyeIcon,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Ucapan",
      value: totalWishes,
      icon: MessageSquareHeartIcon,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-2xl md:text-3xl font-medium">
            Selamat Datang!
          </span>
          <p className="text-muted-foreground">
            Kelola undangan pernikahan digital Anda di sini
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-sidebar border-border shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`size-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invitation ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Undangan Anda</CardTitle>
              <CardDescription>Status dan informasi undangan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Mempelai Pria</span>
                  <span className="font-medium">
                    {invitation.groom_name || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Mempelai Wanita</span>
                  <span className="font-medium">
                    {invitation.bride_name || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Tanggal Acara</span>
                  <span className="font-medium">
                    {invitation.event_date
                      ? new Date(invitation.event_date).toLocaleDateString(
                          "id-ID",
                        )
                      : "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invitation.is_published
                        ? "bg-chart-3/20 text-chart-3"
                        : "bg-accent/20 text-accent-foreground"
                    }`}
                  >
                    {invitation.is_published ? "Dipublikasi" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button asChild className="flex-1">
                  <Link href={`/dashboard/undangan/${invitation.id}`}>
                    Edit Undangan
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>

                {invitation.is_published && (
                  <Button
                    variant="outline"
                    className="hover:text-primary-foreground"
                    asChild
                  >
                    <Link href={`/undangan/${invitation.slug}`} target="_blank">
                      <EyeIcon className="mr-2 size-4" />
                      Lihat
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              <CardDescription>
                Kelola undangan Anda dengan mudah
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent hover:text-primary-foreground"
                asChild
              >
                <Link href="/dashboard/tamu">
                  <UsersIcon className="mr-3 size-4" />
                  Kelola Daftar Tamu
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent hover:text-primary-foreground"
                asChild
              >
                <Link href="/dashboard/ucapan">
                  <MessageSquareHeartIcon className="mr-3 size-4" />
                  Lihat Ucapan & Doa
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-transparent hover:text-primary-foreground"
                asChild
              >
                <Link href="/dashboard/galeri">
                  <EyeIcon className="mr-3 size-4" />
                  Kelola Galeri Foto
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-sidebar border-dashed shadow-none">
          <CardContent className="p-12 text-center">
            <FileTextIcon className="size-16 text-muted-foreground/50 mx-auto mb-4" />
            <span className="text-xl font-semibold mb-2">
              Belum Ada Undangan
            </span>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Mulai buat undangan pernikahan digital Anda sekarang. Pilih tema,
              isi detail acara, dan bagikan ke tamu undangan.
            </p>

            <Button asChild size="lg">
              <Link href="/dashboard/invitations/create">
                <PlusIcon className="mr-2 size-4" />
                Buat Undangan Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
