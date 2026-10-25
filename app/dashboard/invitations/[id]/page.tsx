import { EditInvitationForm } from "@/components/dashboard/edit-invitation-form";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: invitation }, { data: themes }] = await Promise.all([
    supabase
      .from("invitations")
      .select("id,user_id,theme_id,slug,status,is_published,groom_name,groom_nickname,bride_name,bride_nickname,name_order")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("themes")
      .select("id,name,slug,description,category,features,price,is_premium")
      .eq("is_active", true)
      .order("name"),
  ]);

  if (!invitation) notFound();

  return (
    <div className="backend-content mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Edit Info Dasar</h1>
        <p className="text-muted-foreground">Perbarui nama lengkap mempelai dan tema undangan.</p>
      </div>
      <EditInvitationForm invitation={invitation} themes={themes ?? []} />
    </div>
  );
}
