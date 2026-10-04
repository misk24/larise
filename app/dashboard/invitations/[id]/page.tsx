import { EditInvitationForm } from "@/components/dashboard/edit-invitation-form";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditInvitationPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const [{data:invitation},{data:themes}]=await Promise.all([
    supabase.from("invitations").select("id,user_id,theme_id,slug,status,is_published").eq("id",id).eq("user_id",user.id).single(),
    supabase.from("themes").select("id,name,slug,description,category,features,price,is_premium").eq("is_active",true).order("name"),
  ]);
  if(!invitation) notFound();
  return <div className="mx-auto max-w-4xl space-y-6"><div><h1 className="text-2xl font-semibold md:text-3xl">Edit Undangan</h1><p className="text-muted-foreground">Kelola slug, tema, dan lifecycle undangan.</p></div><EditInvitationForm invitation={invitation} themes={themes??[]}/></div>;
}