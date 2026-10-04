import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InvitationActions } from "@/components/dashboard/invitation-actions";
import { createClient } from "@/lib/supabase/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function InvitationsPage() {
  const supabase=await createClient();
  const {data:invitations,error}=await supabase.from("invitations").select("id,theme_id,slug,status,is_published,created_at,updated_at,view_count,themes(name,category,is_premium)").order("created_at",{ascending:false});
  if(error) throw new Error("Gagal memuat undangan.");
  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold md:text-3xl">Undangan Saya</h1><p className="text-muted-foreground">Kelola draft, tema, duplikasi, dan status publikasi.</p></div><Button asChild><Link href="/dashboard/invitations/create"><PlusIcon className="size-4"/>Buat Undangan</Link></Button></div>{invitations?.length?<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{invitations.map(invitation=>{const theme=Array.isArray(invitation.themes)?invitation.themes[0]:invitation.themes;return <Card key={invitation.id}><div className="flex aspect-[4/3] items-center justify-center bg-secondary/40"><div className="text-center"><p className="font-serif text-2xl">{theme?.name??"Tanpa tema"}</p><p className="mt-1 text-sm text-muted-foreground">{invitation.slug}</p><p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{invitation.status}</p></div></div><CardContent className="space-y-4 p-4"><div className="text-sm text-muted-foreground"><p>Tema: {theme?.name??"Belum dipilih"}</p><p>Dibuat: {new Date(invitation.created_at).toLocaleDateString("id-ID")}</p></div><InvitationActions invitationId={invitation.id} published={invitation.is_published}/></CardContent></Card>})}</div>:<Card className="border-dashed"><CardContent className="p-12 text-center"><h2 className="text-xl font-semibold">Belum ada undangan</h2><p className="mt-2 text-muted-foreground">Buat draft pertama Anda dari salah satu tema yang tersedia.</p><Button asChild className="mt-5"><Link href="/dashboard/invitations/create">Buat Undangan</Link></Button></CardContent></Card>}</div>;
}