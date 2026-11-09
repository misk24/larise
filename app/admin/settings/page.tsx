import { BackendPageHeader } from "@/components/backend/backend-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="backend-content space-y-6">
      <BackendPageHeader title="Pengaturan Platform" description="Konfigurasi operasional LARISÉ." />
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Pengaturan umum</CardTitle>
          <CardDescription>Informasi platform dan kontak operasional.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>
              Pengaturan belum dapat disimpan karena platform belum memiliki skema penyimpanan konfigurasi yang disepakati.
              Form akan ditambahkan setelah struktur data dan hak aksesnya ditetapkan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
