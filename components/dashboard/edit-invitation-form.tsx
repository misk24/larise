"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Save, Trash2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationThemeList } from "@/components/dashboard/invitation-theme-list";
import { deleteInvitation, duplicateInvitation, setInvitationPublished, updateInvitation } from "@/lib/actions/invitations";

type Theme = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  features: unknown;
  price: number;
  is_premium: boolean;
};

type Invitation = {
  id: string;
  theme_id: string | null;
  slug: string;
  status: string;
  is_published: boolean;
  groom_name: string;
  groom_nickname: string;
  bride_name: string;
  bride_nickname: string;
  name_order: "groom_first" | "bride_first";
  event_date: string | null;
};

export function EditInvitationForm({ invitation, themes }: { invitation: Invitation; themes: Theme[] }) {
  const [themeId, setThemeId] = useState(invitation.theme_id ?? "");
  const [groomName, setGroomName] = useState(invitation.groom_name);
  const [groomNickname, setGroomNickname] = useState(invitation.groom_nickname);
  const [brideName, setBrideName] = useState(invitation.bride_name);
  const [brideNickname, setBrideNickname] = useState(invitation.bride_nickname);
  const [eventDate, setEventDate] = useState(invitation.event_date ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    try {
      const result = await updateInvitation(invitation.id, {
        themeId,
        groomName,
        groomNickname,
        brideName,
        brideNickname,
        eventDate,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Pengaturan tersimpan.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Hapus undangan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setSaving(true);
    try {
      const result = await deleteInvitation(invitation.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      router.push("/dashboard/invitations");
    } finally {
      setSaving(false);
    }
  }

  async function duplicate() {
    setSaving(true);
    try {
      const result = await duplicateInvitation(invitation.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.id) router.push(`/dashboard/invitations/${result.id}`);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    setSaving(true);
    try {
      const result = await setInvitationPublished(invitation.id, !invitation.is_published);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(invitation.is_published ? "Undipublish." : "Dipublish.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const nameOrderLabel = invitation.name_order === "groom_first"
    ? "Mempelai laki-laki dahulu"
    : "Mempelai wanita dahulu";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lifecycle</CardTitle>
          <CardDescription>Status sekarang: {invitation.status}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={togglePublish} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {invitation.is_published ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" onClick={duplicate} disabled={saving}>
            <Copy className="size-4" /> Duplikat
          </Button>
          <Button variant="destructive" onClick={remove} disabled={saving}>
            <Trash2 className="size-4" /> Hapus
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema undangan</CardTitle>
          <CardDescription>Tema dapat diganti kapan saja. Struktur section akan mengikuti tema yang dipilih.</CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationThemeList themes={themes} selectedThemeId={themeId} onSelect={setThemeId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi dasar</CardTitle>
          <CardDescription>Nama dan tanggal bisa diperbarui. Slug dan urutan nama dikunci sejak draft dibuat.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groomName">Nama lengkap mempelai laki-laki</Label>
              <Input id="groomName" value={groomName} onChange={(event) => setGroomName(event.target.value)} maxLength={120} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomNickname">Nama panggilan mempelai laki-laki</Label>
              <Input id="groomNickname" value={groomNickname} onChange={(event) => setGroomNickname(event.target.value)} maxLength={60} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideName">Nama lengkap mempelai wanita</Label>
              <Input id="brideName" value={brideName} onChange={(event) => setBrideName(event.target.value)} maxLength={120} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideNickname">Nama panggilan mempelai wanita</Label>
              <Input id="brideNickname" value={brideNickname} onChange={(event) => setBrideNickname(event.target.value)} maxLength={60} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="eventDate">Tanggal acara utama</Label>
              <Input id="eventDate" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lockedSlug">Slug undangan</Label>
              <div className="flex items-center gap-2">
                <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
                <Input id="lockedSlug" value={invitation.slug} disabled readOnly />
              </div>
              <p className="text-xs text-muted-foreground">URL ini tetap sama meskipun nama atau status publikasi berubah.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockedNameOrder">Urutan nama pasangan</Label>
              <Input id="lockedNameOrder" value={nameOrderLabel} disabled readOnly />
              <p className="text-xs text-muted-foreground">Dikunci sejak draft pertama kali dibuat, termasuk saat unpublish.</p>
            </div>
          </div>

          <Button onClick={save} disabled={saving || !themeId || !groomName.trim() || !groomNickname.trim() || !brideName.trim() || !brideNickname.trim() || !eventDate}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Simpan perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
