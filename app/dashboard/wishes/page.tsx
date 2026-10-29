import { WishesManager } from "@/components/dashboard/wishes-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type WishesPageProps = { searchParams: Promise<{ invitation?: string }> };

export default async function WishesPage({ searchParams }: WishesPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const { data: invitations, error: invitationsError } = await supabase
    .from("invitations").select("id, slug, groom_name, bride_name, name_order")
    .eq("user_id", user.id).order("created_at", { ascending: false });
  const invitationList = invitations ?? [];
  const invitation = invitationList.find((item) => item.id === params.invitation) ?? invitationList[0];

  return (
    <div className="backend-content space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Manajemen Undangan</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Ucapan & Doa</h1>
        <p className="mt-1 text-sm text-muted-foreground">Moderasi ucapan dari tamu di setiap undangan Anda.</p>
      </div>
      {invitationsError ? (
        <Card className="shadow-none"><CardContent className="p-8 text-sm text-destructive">Daftar undangan gagal dimuat. Coba muat ulang halaman.</CardContent></Card>
      ) : !invitation ? (
        <Card className="border-dashed shadow-none"><CardContent className="p-10 text-center">
          <h2 className="font-semibold">Belum ada undangan</h2>
          <p className="mt-2 text-sm text-muted-foreground">Buat undangan terlebih dahulu untuk mengelola ucapan.</p>
          <Button asChild className="mt-5"><Link href="/dashboard/invitations/create">Buat Undangan</Link></Button>
        </CardContent></Card>
      ) : (
        <>
          {invitationList.length > 1 ? (
            <form action="/dashboard/wishes" method="get" className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="wishes-invitation" className="text-sm font-medium">Pilih undangan</label>
              <select id="wishes-invitation" name="invitation" defaultValue={invitation.id} className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm sm:min-w-72">
                {invitationList.map((item) => <option key={item.id} value={item.id}>{item.name_order === "bride_first" ? item.bride_name : item.groom_name} & {item.name_order === "bride_first" ? item.groom_name : item.bride_name} · /{item.slug}</option>)}
              </select>
              <Button type="submit" variant="secondary">Tampilkan</Button>
            </form>
          ) : null}
          <Card className="shadow-none"><CardContent className="p-4 sm:p-6">
            <p className="mb-4 text-sm text-muted-foreground">Undangan: <span className="font-medium text-foreground">/{invitation.slug}</span></p>
            <WishesData invitationId={invitation.id} />
          </CardContent></Card>
        </>
      )}
    </div>
  );
}

async function WishesData({ invitationId }: { invitationId: string }) {
  const supabase = await createClient();
  const { data: wishes, error } = await supabase.from("wishes").select("*").eq("invitation_id", invitationId).order("created_at", { ascending: false });
  if (error) return <p className="text-sm text-destructive">Ucapan gagal dimuat. Coba muat ulang halaman.</p>;
  return <WishesManager initialWishes={wishes ?? []} />;
}
