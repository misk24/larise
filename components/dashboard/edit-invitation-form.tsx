"use client"

import { createClient } from "@/lib/supabase/client"
import type { Invitation, Template } from "@/types/database"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import Link from "next/link"
import { ExternalLink, Loader2, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/textarea"

interface EditInvitationFormProps {
  invitation: Invitation & { templates: Template | null }
  templates: Template[]
}

export function EditInvitationForm({ invitation, templates }: EditInvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  // const [formData, setFormData] = useState({
  //   templateId: invitation.template_id || "",
  //   groomName: invitation.groom_name || "",
  //   brideName: invitation.bride_name || "",
  //   groomParents: invitation.groom_parents || "",
  //   brideParents: invitation.bride_parents || "",
  //   eventDate: invitation.event_date || "",
  //   eventTime: invitation.event_time || "",
  //   akadTime: invitation.akad_time || "",
  //   venue: invitation.venue_name || "",
  //   venueAddress: invitation.venue_address || "",
  //   akadVenue: invitation.akad_venue || "",
  //   akadVenueAddress: invitation.akad_address || "",
  //   slug: invitation.slug || "",
  //   loveStory: invitation.love_story || "",
  //   bankName: invitation.bank_name || "",
  //   bankAccount: invitation.bank_account || "",
  //   bankHolder: invitation.bank_holder || "",
  //   isPublished: invitation.is_published || false,
  // })

  const router = useRouter()
  const supabase = createClient()

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     const { error } = await supabase
  //       .from("invitations")
  //       .update({
  //         template_id: formData.templateId,
  //         slug: formData.slug,
  //         groom_name: formData.groomName,
  //         bride_name: formData.brideName,
  //         groom_parents: formData.groomParents,
  //         bride_parents: formData.brideParents,
  //         event_date: formData.eventDate,
  //         event_time: formData.eventTime,
  //         akad_time: formData.akadTime,
  //         venue_name: formData.venue,
  //         venue_address: formData.venueAddress,
  //         akad_venue: formData.akadVenue,
  //         akad_address: formData.akadVenueAddress,
  //         love_story: formData.loveStory,
  //         bank_name: formData.bankName,
  //         bank_account: formData.bankAccount,
  //         bank_holder: formData.bankHolder,
  //         is_published: formData.isPublished,
  //       })
  //       .eq("id", invitation.id)

  //     if (error) {
  //       if (error.code === "23505") {
  //         toast.error("URL undangan sudah digunakan. Silakan ubah.")
  //       } else {
  //         toast.error(error.message)
  //       }
  //       return
  //     }

  //     toast.success("Undangan berhasil diperbarui!")
  //     router.refresh()
  //   } catch {
  //     toast.error("Terjadi kesalahan. Silakan coba lagi.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      const { error } = await supabase.from("invitations").delete().eq("id", invitation.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Undangan berhasil dihapus!")
      router.push("/dashboard/undangan")
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form>
    {/* <form onSubmit={handleSubmit}> */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Switch
            id="published"
            // checked={formData.isPublished}
            // onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked }))}
          />
          <Label htmlFor="published" className="cursor-pointer">
            Draft
            {/* {formData.isPublished ? "Dipublikasi" : "Draft"} */}
          </Label>
        </div>
        <div className="flex-1" />
        {/* {formData.isPublished && ( */}
          <Button type="button" variant="outline" asChild>
            <Link href="" target="_blank">
            {/* <Link href={`/undangan/${formData.slug}`} target="_blank"> */}
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Undangan
            </Link>
          </Button>
        {/* )} */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Undangan?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Semua data undangan termasuk daftar tamu dan ucapan akan dihapus
                permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Simpan
        </Button>
      </div>

      <Tabs defaultValue="mempelai" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mempelai">Mempelai</TabsTrigger>
          <TabsTrigger value="acara">Acara</TabsTrigger>
          <TabsTrigger value="cerita">Cerita</TabsTrigger>
          <TabsTrigger value="hadiah">Hadiah</TabsTrigger>
        </TabsList>

        <TabsContent value="mempelai">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Data Mempelai</CardTitle>
              <CardDescription>Informasi kedua mempelai</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groomName">Nama Mempelai Pria</Label>
                  <Input
                    id="groomName"
                    name="groomName"
                    // value={formData.groomName}
                    // onChange={handleInputChange}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomParents">Nama Orang Tua Pria</Label>
                  <Textarea
                    id="groomParents"
                    name="groomParents"
                    // value={formData.groomParents}
                    // onChange={handleInputChange}
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
                    // value={formData.brideName}
                    // onChange={handleInputChange}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideParents">Nama Orang Tua Wanita</Label>
                  <Textarea
                    id="brideParents"
                    name="brideParents"
                    // value={formData.brideParents}
                    // onChange={handleInputChange}
                    placeholder="Putri dari Bapak ... dan Ibu ..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acara">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Detail Acara</CardTitle>
              <CardDescription>Waktu dan tempat acara</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Tanggal Acara</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    // value={formData.eventDate}
                    // onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="akadTime">Waktu Akad</Label>
                  <Input
                    id="akadTime"
                    name="akadTime"
                    type="time"
                    // value={formData.akadTime}
                    // onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Waktu Resepsi</Label>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    // value={formData.eventTime}
                    // onChange={handleInputChange}
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
                      // value={formData.akadVenue}
                      // onChange={handleInputChange}
                      placeholder="Nama gedung/tempat akad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akadVenueAddress">Alamat Akad</Label>
                    <Textarea
                      id="akadVenueAddress"
                      name="akadVenueAddress"
                      // value={formData.akadVenueAddress}
                      // onChange={handleInputChange}
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
                      // value={formData.venue}
                      // onChange={handleInputChange}
                      placeholder="Nama gedung/tempat resepsi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">Alamat Resepsi</Label>
                    <Textarea
                      id="venueAddress"
                      name="venueAddress"
                      // value={formData.venueAddress}
                      // onChange={handleInputChange}
                      placeholder="Alamat lengkap"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Undangan</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">nikahku.id/undangan/</span>
                  <Input
                    id="slug"
                    name="slug"
                    // value={formData.slug}
                    // onChange={handleInputChange}
                    placeholder="nama-url"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cerita">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Cerita Cinta</CardTitle>
              <CardDescription>Bagikan kisah perjalanan cinta Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="loveStory">Cerita Kami</Label>
                <Textarea
                  id="loveStory"
                  name="loveStory"
                  // value={formData.loveStory}
                  // onChange={handleInputChange}
                  placeholder="Ceritakan bagaimana kalian bertemu dan jatuh cinta..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hadiah">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Amplop Digital</CardTitle>
              <CardDescription>Informasi rekening untuk hadiah dari tamu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nama Bank</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  // value={formData.bankName}
                  // onChange={handleInputChange}
                  placeholder="BCA, Mandiri, BNI, dll"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Nomor Rekening</Label>
                <Input
                  id="bankAccount"
                  name="bankAccount"
                  // value={formData.bankAccount}
                  // onChange={handleInputChange}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankHolder">Nama Pemilik Rekening</Label>
                <Input
                  id="bankHolder"
                  name="bankHolder"
                  // value={formData.bankHolder}
                  // onChange={handleInputChange}
                  placeholder="Nama sesuai rekening"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
