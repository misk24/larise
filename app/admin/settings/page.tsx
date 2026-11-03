import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="backend-content space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Pengaturan Platform</h1>
        <p className="text-muted-foreground">Konfigurasi operasional LARISÉ.</p>
      </header>
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
