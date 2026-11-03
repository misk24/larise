import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>Belum tersedia</AlertTitle>
            <AlertDescription>
              Pengaturan belum dapat disimpan karena platform belum memiliki skema penyimpanan konfigurasi yang disepakati.
              Form akan ditambahkan setelah struktur data dan hak aksesnya ditetapkan.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
