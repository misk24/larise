"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import type { Guest, RSVP, RSVPStatus } from "@/types/database";
import { Check, Copy, Loader2, Pencil, Plus, Search, Trash2, UserCheck, UserX, Users } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type GuestWithRsvp = Guest & { rsvp: RSVP[] | RSVP | null };
type GuestForm = { name: string; phone: string; email: string };

interface GuestManagerProps {
  invitationId: string;
  invitationSlug: string;
  initialGuests: GuestWithRsvp[];
}

const emptyForm: GuestForm = { name: "", phone: "", email: "" };

function latestRsvp(guest: GuestWithRsvp): RSVP | undefined {
  const rsvps = Array.isArray(guest.rsvp)
    ? guest.rsvp
    : guest.rsvp
      ? [guest.rsvp]
      : [];

  return [...rsvps].sort((a, b) =>
    new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime()
  )[0];
}

export function GuestManager({ invitationId, initialGuests, invitationSlug }: GuestManagerProps) {
  const [guests, setGuests] = useState<GuestWithRsvp[]>(initialGuests);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestWithRsvp | null>(null);
  const [form, setForm] = useState<GuestForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RSVPStatus>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createClient();

  const stats = useMemo(() => {
    const statuses = guests.map(latestRsvp);
    return {
      total: guests.length,
      attending: statuses.filter((r) => r?.status === "attending").length,
      notAttending: statuses.filter((r) => r?.status === "not_attending").length,
      pending: statuses.filter((r) => !r || r.status === "pending").length,
      attendees: statuses.reduce((total, r) => total + (r?.status === "attending" ? r.attendee_count : 0), 0),
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return guests.filter((guest) => {
      const matchesSearch = !query ||
        guest.name.toLocaleLowerCase().includes(query) ||
        (guest.phone ?? "").toLocaleLowerCase().includes(query) ||
        (guest.email ?? "").toLocaleLowerCase().includes(query);
      const status = latestRsvp(guest)?.status ?? "pending";
      return matchesSearch && (statusFilter === "all" || status === statusFilter);
    });
  }, [guests, searchQuery, statusFilter]);

  function openAddDialog() {
    setEditingGuest(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  }

  function openEditDialog(guest: GuestWithRsvp) {
    setEditingGuest(guest);
    setForm({ name: guest.name, phone: guest.phone ?? "", email: guest.email ?? "" });
    setIsDialogOpen(true);
  }

  async function handleSaveGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      toast.error("Nama tamu wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const values = {
        name,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
      };

      if (editingGuest) {
        const { data, error } = await supabase
          .from("guests")
          .update(values)
          .eq("id", editingGuest.id)
          .eq("invitation_id", invitationId)
          .select("*, rsvp:rsvps(*)")
          .single();
        if (error) {
          toast.error("Gagal memperbarui tamu. " + error.message);
          return;
        }
        setGuests((current) => current.map((guest) => guest.id === data.id ? data : guest));
        toast.success("Data tamu berhasil diperbarui.");
      } else {
        const { data, error } = await supabase
          .from("guests")
          .insert({ ...values, invitation_id: invitationId })
          .select("*, rsvp:rsvps(*)")
          .single();
        if (error) {
          toast.error("Gagal menambahkan tamu. " + error.message);
          return;
        }
        setGuests((current) => [...current, data]);
        toast.success("Tamu berhasil ditambahkan.");
      }
      setIsDialogOpen(false);
      setEditingGuest(null);
      setForm(emptyForm);
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan data tamu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteGuest(guest: GuestWithRsvp) {
    if (!window.confirm(`Hapus tamu “${guest.name}”? Data RSVP terkait juga bisa terpengaruh.`)) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", guest.id)
        .eq("invitation_id", invitationId);
      if (error) {
        toast.error("Gagal menghapus tamu. " + error.message);
        return;
      }
      setGuests((current) => current.filter((item) => item.id !== guest.id));
      toast.success("Tamu berhasil dihapus.");
    } catch {
      toast.error("Terjadi kesalahan saat menghapus tamu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyInvitationLink(guestToken: string) {
    const link = `${window.location.origin}/${invitationSlug}?guest=${encodeURIComponent(guestToken)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(guestToken);
      toast.success("Link undangan disalin.");
      window.setTimeout(() => setCopiedId((current) => current === guestToken ? null : current), 2000);
    } catch {
      toast.error("Link gagal disalin. Periksa izin clipboard browser.");
    }
  }

  function getRsvpBadge(guest: GuestWithRsvp) {
    const status = latestRsvp(guest)?.status;
    if (status === "attending") return <Badge className="border-chart-3/30 bg-chart-3/20 text-chart-3">Hadir</Badge>;
    if (status === "not_attending") return <Badge variant="destructive">Tidak hadir</Badge>;
    return <Badge variant="secondary">Menunggu</Badge>;
  }

  const statCards = [
    { label: "Total tamu", value: stats.total, icon: Users },
    { label: "Konfirmasi hadir", value: stats.attending, icon: UserCheck },
    { label: "Tidak hadir", value: stats.notAttending, icon: UserX },
    { label: "Menunggu RSVP", value: stats.pending, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daftar Tamu</CardTitle>
              <CardDescription>
                {stats.attendees} orang diperkirakan hadir berdasarkan RSVP yang masuk.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) { setEditingGuest(null); setForm(emptyForm); }
            }}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}><Plus className="mr-2 size-4" />Tambah tamu</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSaveGuest}>
                  <DialogHeader>
                    <DialogTitle>{editingGuest ? "Edit data tamu" : "Tambah tamu baru"}</DialogTitle>
                    <DialogDescription>Nama wajib diisi. Nomor WhatsApp dan email opsional.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="guest-name">Nama tamu *</Label>
                      <Input id="guest-name" autoComplete="name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} maxLength={120} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-phone">Nomor WhatsApp</Label>
                      <Input id="guest-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} maxLength={32} placeholder="08123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-email">Email</Label>
                      <Input id="guest-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} maxLength={254} placeholder="email@example.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                      {editingGuest ? "Simpan perubahan" : "Tambah tamu"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Cari tamu" placeholder="Cari nama, telepon, atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <select
              aria-label="Filter status RSVP"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="all">Semua status RSVP</option>
              <option value="pending">Menunggu</option>
              <option value="attending">Hadir</option>
              <option value="not_attending">Tidak hadir</option>
            </select>
          </div>

          {filteredGuests.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead className="hidden md:table-cell">Kontak</TableHead>
                    <TableHead>Status RSVP</TableHead>
                    <TableHead className="hidden sm:table-cell">Jumlah hadir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest) => {
                    const rsvp = latestRsvp(guest);
                    return (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">
                          <div>{guest.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{guest.phone || guest.email || "Kontak belum diisi"}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>{guest.phone || "-"}</div>
                          <div className="text-xs text-muted-foreground">{guest.email || ""}</div>
                        </TableCell>
                        <TableCell>{getRsvpBadge(guest)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{rsvp?.status === "attending" ? rsvp.attendee_count : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button type="button" variant="ghost" size="icon" aria-label={`Salin link untuk ${guest.name}`} onClick={() => copyInvitationLink(guest.public_token)}>
                              {copiedId === guest.public_token ? <Check className="size-4 text-chart-3" /> : <Copy className="size-4" />}
                            </Button>
                            <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${guest.name}`} onClick={() => openEditDialog(guest)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" aria-label={`Hapus ${guest.name}`} disabled={isLoading} onClick={() => handleDeleteGuest(guest)} className="text-destructive hover:text-destructive">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {guests.length === 0 ? "Belum ada tamu. Tambahkan tamu pertama Anda." : "Tidak ada tamu yang cocok dengan pencarian atau filter."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
