import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-2xl md:text-3xl font-medium">Pengaturan</span>
        <p className="text-muted-foreground">Konfigurasi website dan sistem</p>
      </div>
      <Card className="border-border bg-sidebar">
        <CardHeader>
          <CardTitle>Informasi Website</CardTitle>
          <CardDescription>Pengaturan umum website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nama Website</Label>
            <Input id="siteName" defaultValue="LARISÉ" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Deskripsi</Label>
            <Textarea
              id="siteDescription"
              defaultValue="Platform undangan pernikahan digital terpercaya"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              defaultValue="hello@nikahku.id"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input id="whatsapp" defaultValue="6281234567890" />
          </div>
          <Button>Simpan Pengaturan</Button>
        </CardContent>
      </Card>
      <Card className="border-border bg-sidebar">
        <CardHeader>
          <CardTitle>Informasi Pembayaran</CardTitle>
          <CardDescription>
            Konfigurasi rekening untuk pembayaran manual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Nama Bank</Label>
            <Input id="bankName" placeholder="BCA, Mandiri, BNI, dll" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Nomor Rekening</Label>
            <Input id="bankAccount" placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankHolder">Nama Pemilik Rekening</Label>
            <Input id="bankHolder" placeholder="Nama sesuai rekening" />
          </div>
          <Button>Simpan Pengaturan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
