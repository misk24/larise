"use client"

import { createClient } from "@/lib/supabase/client"
import type { Guest, RSVP } from "@/types/database"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Check, Copy, Loader2, Plus, Search, Trash2, UserCheck, Users, UserX } from "lucide-react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface GuestManagerProps {
  invitationId: string
  initialGuests: (Guest & { rsvp: RSVP[] })[]
}

export function GuestManager() {
// export function GuestManager({ invitationId, initialGuests }: GuestManagerProps) {
  // const [guests, setGuests] = useState(initialGuests)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newGuest, setNewGuest] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const supabase = createClient()

  // const filteredGuests = guests.filter(
  //   (guest) =>
  //     guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     guest.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
  // )

  // const stats = {
  //   total: guests.length,
  //   attending: guests.filter((g) => g.rsvp?.[0]?.status === "attending").length,
  //   notAttending: guests.filter((g) => g.rsvp?.[0]?.status === "not_attending").length,
  //   pending: guests.filter((g) => !g.rsvp?.[0] || g.rsvp[0].status === "pending").length,
  // }

  // async function handleAddGuest(e: React.FormEvent) {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     const { data, error } = await supabase
  //       .from("guests")
  //       .insert({
  //         invitation_id: invitationId,
  //         name: newGuest.name,
  //         phone: newGuest.phone || null,
  //         email: newGuest.email || null,
  //       })
  //       .select("*, rsvp(*)")
  //       .single()

  //     if (error) {
  //       toast.error(error.message)
  //       return
  //     }

  //     setGuests((prev) => [...prev, data])
  //     setNewGuest({ name: "", phone: "", email: "" })
  //     setIsDialogOpen(false)
  //     toast.success("Tamu berhasil ditambahkan!")
  //   } catch {
  //     toast.error("Terjadi kesalahan")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // async function handleDeleteGuest(guestId: string) {
  //   try {
  //     const { error } = await supabase.from("guests").delete().eq("id", guestId)

  //     if (error) {
  //       toast.error(error.message)
  //       return
  //     }

  //     setGuests((prev) => prev.filter((g) => g.id !== guestId))
  //     toast.success("Tamu berhasil dihapus!")
  //   } catch {
  //     toast.error("Terjadi kesalahan")
  //   }
  // }

  // function copyInvitationLink(guestSlug: string) {
  //   const link = `${window.location.origin}/undangan/${guestSlug}`
  //   navigator.clipboard.writeText(link)
  //   setCopiedId(guestSlug)
  //   toast.success("Link undangan disalin!")
  //   setTimeout(() => setCopiedId(null), 2000)
  // }

  // function getRsvpBadge(rsvp: RSVP[] | undefined) {
  //   const status = rsvp?.[0]?.status
  //   if (status === "attending") {
  //     return <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">Hadir</Badge>
  //   }
  //   if (status === "not_attending") {
  //     return <Badge variant="destructive">Tidak Hadir</Badge>
  //   }
  //   return <Badge variant="secondary">Menunggu</Badge>
  // }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              {/* <p className="text-2xl font-semibold">{stats.total}</p> */}
              <p className="text-xs text-muted-foreground">Total Tamu</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              {/* <p className="text-2xl font-semibold">{stats.attending}</p> */}
              <p className="text-xs text-muted-foreground">Hadir</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              {/* <p className="text-2xl font-semibold">{stats.notAttending}</p> */}
              <p className="text-xs text-muted-foreground">Tidak Hadir</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              {/* <p className="text-2xl font-semibold">{stats.pending}</p> */}
              <p className="text-xs text-muted-foreground">Menunggu</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Daftar Tamu</CardTitle>
              <CardDescription>Kelola tamu undangan dan lihat status RSVP</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Tamu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form>
                {/* <form onSubmit={handleAddGuest}> */}
                  <DialogHeader>
                    <DialogTitle>Tambah Tamu Baru</DialogTitle>
                    <DialogDescription>Masukkan data tamu undangan baru</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Tamu *</Label>
                      <Input
                        id="name"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor WhatsApp</Label>
                      <Input
                        id="phone"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="08123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Tambah
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau nomor telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* {filteredGuests.length > 0 ? ( */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead className="hidden md:table-cell">Telepon</TableHead>
                    <TableHead>Status RSVP</TableHead>
                    <TableHead className="hidden md:table-cell">Jumlah Tamu</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {filteredGuests.map((guest) => ( */}
                    <TableRow>
                    {/* <TableRow key={guest.id}> */}
                      {/* <TableCell className="font-medium">{guest.name}</TableCell> */}
                      {/* <TableCell className="hidden md:table-cell">{guest.phone || "-"}</TableCell> */}
                      {/* <TableCell>{getRsvpBadge(guest.rsvp)}</TableCell> */}
                      {/* <TableCell className="hidden md:table-cell">{guest.rsvp?.[0]?.guest_count || "-"}</TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => copyInvitationLink(guest.slug)}
                            title="Salin link undangan"
                          >
                            {/* {copiedId === guest.slug ? ( */}
                              <Check className="h-4 w-4 text-chart-3" />
                            {/* ) : ( */}
                              <Copy className="h-4 w-4" />
                            {/* )} */}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => handleDeleteGuest(guest.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  {/* ))} */}
                </TableBody>
              </Table>
            </div>
          {/* ) : ( */}
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Tidak ada tamu yang ditemukan" : "Belum ada tamu. Tambahkan tamu pertama Anda."}
              </p>
            </div>
          {/* )} */}
        </CardContent>
      </Card>
    </div>
  )
}
