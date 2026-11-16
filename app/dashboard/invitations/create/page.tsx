import { BackendPageHeader } from "@/components/backend/backend-ui";
import { CreateInvitationForm } from "@/components/dashboard/create-invitation-form";
import { createClient } from "@/lib/supabase/server";

export default async function CreateInvitationPage() {
  const supabase = await createClient();
  const { data: themes, error } = await supabase
    .from("themes")
    .select("id,name,slug,description,category,features,price,is_premium")
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error("Gagal memuat tema.");

  return (
    <div className="backend-content w-full space-y-8">
      <BackendPageHeader title="Buat Undangan" description="Mulai dari informasi dasar, lalu pilih tema yang sesuai." />
      <CreateInvitationForm themes={themes ?? []} />
    </div>
  );
}
