import { BackendEmptyState, BackendPageHeader } from "@/components/backend/backend-ui";
import { SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="backend-content space-y-6">
      <BackendPageHeader title="Pengaturan Platform" description="Konfigurasi operasional LARISÉ." />
      <BackendEmptyState
        icon={SettingsIcon}
        title="Pengaturan belum tersedia"
        description="Pengaturan belum bisa disimpan karena platform belum punya skema penyimpanan konfigurasi. Formulir akan ditambahkan setelah struktur data dan hak aksesnya ditetapkan."
      />
    </div>
  );
}
