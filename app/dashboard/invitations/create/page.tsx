import { CreateInvitationForm } from "@/components/dashboard/create-invitation-form";
import { createClient } from "@/lib/supabase/server";

export default async function CreateInvitationPage() {
  const supabase=await createClient();
  const {data:themes,error}=await supabase.from("themes").select("id,name,slug,description,category,features,price,is_premium").eq("is_active",true).order("name");
  if(error) throw new Error("Gagal memuat tema.");
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold md:text-3xl">Buat Undangan</h1><p className="text-muted-foreground">Mulai dari draft dan satu tema yang sudah terdefinisi.</p></div><CreateInvitationForm themes={themes??[]}/></div>;
}