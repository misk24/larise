"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Invitation, Theme } from "@/types/database";
import { Loader2, Save, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";
import { toast } from "sonner";

interface Props { invitation: Invitation & { themes: Theme | null }; themes: Theme[]; }

export function EditInvitationForm({ invitation, themes }: Props) {
  const [isLoading,setIsLoading]=useState(false);
  const [isDeleting,setIsDeleting]=useState(false);
  const [form,setForm]=useState({
    theme_id: invitation.theme_id || "",
    slug: invitation.slug || "",
    groom_name: invitation.groom_name || "",
    groom_father: invitation.groom_father || "",
    groom_mother: invitation.groom_mother || "",
    bride_name: invitation.bride_name || "",
    bride_father: invitation.bride_father || "",
    bride_mother: invitation.bride_mother || "",
    akad_date: invitation.akad_date || "",
    akad_time: invitation.akad_time || "",
    akad_location: invitation.akad_location || "",
    akad_address: invitation.akad_address || "",
    akad_maps_url: invitation.akad_maps_url || "",
    resepsi_date: invitation.resepsi_date || "",
    resepsi_time: invitation.resepsi_time || "",
    resepsi_location: invitation.resepsi_location || "",
    resepsi_address: invitation.resepsi_address || "",
    resepsi_maps_url: invitation.resepsi_maps_url || "",
    love_story: invitation.love_story || "",
    opening_text: invitation.opening_text || "",
    closing_text: invitation.closing_text || "",
    is_published: invitation.is_published,
  });

  const router=useRouter();
  const supabase=createClient();

  const change=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p=>({...p,[e.target.name]:e.target.value}));

  async function save(e:React.FormEvent) {
    e.preventDefault(); setIsLoading(true);
    try {
      const {error}=await supabase.from("invitations").update({
        theme_id: form.theme_id || null, slug: form.slug.trim(),
        groom_name: form.groom_name.trim(), groom_father: form.groom_father.trim() || null,
        groom_mother: form.groom_mother.trim() || null, bride_name: form.bride_name.trim(),
        bride_father: form.bride_father.trim() || null, bride_mother: form.bride_mother.trim() || null,
        akad_date: form.akad_date || null, akad_time: form.akad_time || null,
        akad_location: form.akad_location.trim() || null, akad_address: form.akad_address.trim() || null,
        akad_maps_url: form.akad_maps_url.trim() || null, resepsi_date: form.resepsi_date || null,
        resepsi_time: form.resepsi_time || null, resepsi_location: form.resepsi_location.trim() || null,
        resepsi_address: form.resepsi_address.trim() || null, resepsi_maps_url: form.resepsi_maps_url.trim() || null,
        love_story: form.love_story.trim() || null, opening_text: form.opening_text.trim(),
        closing_text: form.closing_text.trim(), is_published: form.is_published,
      }).eq("id",invitation.id);
      if(error){ toast.error(error.code==="23505" ? "URL undangan sudah digunakan." : error.message); return; }
      toast.success("Undangan berhasil disimpan."); router.refresh();
    } finally { setIsLoading(false); }
  }

  async function remove() {
    setIsDeleting(true);
    try {
      const {error}=await supabase.from("invitations").delete().eq("id",invitation.id);
      if(error){toast.error(error.message);return;}
      toast.success("Undangan dihapus."); router.push("/dashboard/invitations");
    } finally { setIsDeleting(false); }
  }

  const field=(name:keyof typeof form,label:string,type="text",placeholder="")=>(
    <div className="space-y-2"><Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} value={String(form[name])} onChange={change} placeholder={placeholder}/>
    </div>
  );
  return <form onSubmit={save} className="space-y-6">
    <div className="flex flex-wrap items-center gap-3">
      <Switch checked={form.is_published} onCheckedChange={v=>setForm(p=>({...p,is_published:v}))}/>
      <span className="text-sm">{form.is_published ? "Dipublikasi" : "Draft"}</span>
      <div className="flex-1"/>
      {form.is_published && <Button type="button" variant="outline" asChild><Link href={`/${form.slug}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4"/>Lihat</Link></Button>}
      <Button type="button" variant="destructive" onClick={remove} disabled={isDeleting}><Trash2 className="mr-2 h-4 w-4"/>Hapus</Button>
      <Button type="submit" disabled={isLoading}>{isLoading?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Save className="mr-2 h-4 w-4"/>}Simpan</Button>
    </div>

    <Card><CardHeader><CardTitle>Mempelai</CardTitle><CardDescription>Data kedua mempelai dan orang tua.</CardDescription></CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">{field("groom_name","Nama Mempelai Pria")} {field("groom_father","Nama Ayah Pria")} {field("groom_mother","Nama Ibu Pria")}</div>
        <div className="space-y-4">{field("bride_name","Nama Mempelai Wanita")} {field("bride_father","Nama Ayah Wanita")} {field("bride_mother","Nama Ibu Wanita")}</div>
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Akad</CardTitle><CardDescription>Informasi akad nikah.</CardDescription></CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {field("akad_date","Tanggal Akad","date")} {field("akad_time","Waktu Akad","time")}
        {field("akad_location","Tempat Akad")} {field("akad_address","Alamat Akad")}
        {field("akad_maps_url","Google Maps Akad","url","https://maps.google.com/...")}
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Resepsi</CardTitle><CardDescription>Informasi resepsi.</CardDescription></CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {field("resepsi_date","Tanggal Resepsi","date")} {field("resepsi_time","Waktu Resepsi","time")}
        {field("resepsi_location","Tempat Resepsi")} {field("resepsi_address","Alamat Resepsi")}
        {field("resepsi_maps_url","Google Maps Resepsi","url","https://maps.google.com/...")}
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Konten</CardTitle><CardDescription>Konten utama yang akan digunakan renderer.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div>{field("slug","URL Undangan","","nama-mempelai")}</div>
        <div className="space-y-2"><Label htmlFor="love_story">Cerita Cinta</Label><Textarea id="love_story" name="love_story" value={form.love_story} onChange={change} rows={8}/></div>
        <div className="space-y-2"><Label htmlFor="opening_text">Pembuka</Label><Textarea id="opening_text" name="opening_text" value={form.opening_text} onChange={change} rows={4}/></div>
        <div className="space-y-2"><Label htmlFor="closing_text">Penutup</Label><Textarea id="closing_text" name="closing_text" value={form.closing_text} onChange={change} rows={4}/></div>
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Tema</CardTitle><CardDescription>Pilih tema aktif.</CardDescription></CardHeader>
      <CardContent><select value={form.theme_id} onChange={e=>setForm(p=>({...p,theme_id:e.target.value}))} className="w-full rounded-md border bg-background p-2">
        <option value="">Tanpa tema</option>{themes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
      </select></CardContent>
    </Card>
  </form>;
}
