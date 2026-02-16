"use client";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "@/types/database";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateInvitationFormProps {
  themes: Theme[];
}

export function CreateInvitationForm({ themes }: CreateInvitationFormProps) {
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    groomParents: "",
    brideParents: "",
    eventDate: "",
    eventTime: "",
    akadTime: "",
    venue: "",
    venueAddress: "",
    akadVenue: "",
    akadVenueAddress: "",
    slug: "",
  });

  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from names
    if (name === "groomName" || name === "brideName") {
      const groom = name === "groomName" ? value : formData.groomName;
      const bride = name === "brideName" ? value : formData.brideName;
      if (groom && bride) {
        const slug = `${groom.toLowerCase().replace(/\s+/g, "-")}-${bride.toLowerCase().replace(/\s+/g, "-")}`;
        setFormData((prev) => ({ ...prev, slug }));
      }
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const { data, error } = await supabase
        .from("invitations")
        .insert({
          user_id: user.id,
          theme_id: selectedTheme,
          slug: formData.slug,
          groom_name: formData.groomName,
          bride_name: formData.brideName,
          groom_parents: formData.groomParents,
          bride_parents: formData.brideParents,
          event_date: formData.eventDate,
          event_time: formData.eventTime,
          akad_time: formData.akadTime,
          venue_name: formData.venue,
          venue_address: formData.venueAddress,
          akad_venue: formData.akadVenue,
          akad_address: formData.akadVenueAddress,
          is_published: false,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("URL undangan sudah digunakan. Silakan ubah.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Undangan berhasil dibuat!");
      router.push(`/dashboard/undangan/${data.id}`);
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Pilih Tema</CardTitle>
            <CardDescription>
              Pilih desain tema yang sesuai dengan tema pernikahan Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              className="grid md:grid-cols-3 gap-4"
            >
              {themes.map((theme) => (
                <Label
                  key={theme.id}
                  htmlFor={theme.id}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                    selectedTheme === theme.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/50"
                  }`}
                >
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="sr-only"
                  />
                  <div className="aspect-2/3 bg-secondary/50 relative">
                    {/* {theme.preview_image ? (
                      <Image
                        src={theme.preview_image || "/placeholder.svg"}
                        alt={theme.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Preview
                      </div>
                    )} */}
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {theme.category}
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedTheme}
              >
                Lanjutkan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Data Mempelai</CardTitle>
              <CardDescription>
                Masukkan informasi kedua mempelai
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groomName">Nama Mempelai Pria</Label>
                  <Input
                    id="groomName"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomParents">Nama Orang Tua Pria</Label>
                  <Textarea
                    id="groomParents"
                    name="groomParents"
                    value={formData.groomParents}
                    onChange={handleInputChange}
                    placeholder="Putra dari Bapak ... dan Ibu ..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Nama Mempelai Wanita</Label>
                  <Input
                    id="brideName"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideParents">Nama Orang Tua Wanita</Label>
                  <Textarea
                    id="brideParents"
                    name="brideParents"
                    value={formData.brideParents}
                    onChange={handleInputChange}
                    placeholder="Putri dari Bapak ... dan Ibu ..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Detail Acara</CardTitle>
              <CardDescription>
                Masukkan informasi waktu dan tempat acara
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Tanggal Acara</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="akadTime">Waktu Akad</Label>
                  <Input
                    id="akadTime"
                    name="akadTime"
                    type="time"
                    value={formData.akadTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Waktu Resepsi</Label>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="akadVenue">Tempat Akad</Label>
                    <Input
                      id="akadVenue"
                      name="akadVenue"
                      value={formData.akadVenue}
                      onChange={handleInputChange}
                      placeholder="Nama gedung/tempat akad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akadVenueAddress">Alamat Akad</Label>
                    <Textarea
                      id="akadVenueAddress"
                      name="akadVenueAddress"
                      value={formData.akadVenueAddress}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Tempat Resepsi</Label>
                    <Input
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      placeholder="Nama gedung/tempat resepsi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">Alamat Resepsi</Label>
                    <Textarea
                      id="venueAddress"
                      name="venueAddress"
                      value={formData.venueAddress}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>URL Undangan</CardTitle>
              <CardDescription>
                Buat URL unik untuk undangan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Undangan</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    nikahku.id/undangan/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="nama-url"
                    className="flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Hanya gunakan huruf kecil, angka, dan tanda hubung (-)
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              className="hover:text-primary-foreground"
              onClick={() => setStep(1)}
            >
              Kembali
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Undangan
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
