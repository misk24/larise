"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationThemeCard } from "@/components/dashboard/invitation-theme-card";
import { createInvitation } from "@/lib/actions/invitations";
import { buildInvitationSlug } from "@/lib/validation/invitation";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type React from "react";
import { toast } from "sonner";

type Theme = { id:string; name:string; slug:string; description:string|null; category:string; features:unknown; price:number; is_premium:boolean };

export function CreateInvitationForm({ themes }: { themes: Theme[] }) {
  const [themeId,setThemeId]=useState("");
  const [groomName,setGroomName]=useState("");
  const [brideName,setBrideName]=useState("");
  const [slug,setSlug]=useState("");
  const [loading,setLoading]=useState(false);
  const generatedSlug=useMemo(()=>buildInvitationSlug(groomName,brideName),[groomName,brideName]);

  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true);
    try {
      const result=await createInvitation({themeId,groomName,brideName,slug:slug||generatedSlug});
      if(result?.error){toast.error(result.error);return;}
    } catch(error) {
      if(error instanceof Error && error.message.includes("NEXT_REDIRECT")) return;
      toast.error("Undangan gagal dibuat.");
    } finally { setLoading(false); }
  }

  return <form onSubmit={submit} className="space-y-6">
    <Card><CardHeader><CardTitle>Pilih tema</CardTitle><CardDescription>Theme menentukan struktur awal undangan. Anda tetap bisa menggantinya nanti.</CardDescription></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{themes.map(theme=><InvitationThemeCard key={theme.id} theme={theme} selected={themeId===theme.id} onSelect={()=>setThemeId(theme.id)}/>)}</CardContent>
    </Card>
    <Card><CardHeader><CardTitle>Identitas awal</CardTitle><CardDescription>Data ini menjadi fondasi draft. Detail section dikembangkan pada Phase 4/5.</CardDescription></CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="groomName">Nama mempelai pria</Label><Input id="groomName" value={groomName} onChange={e=>setGroomName(e.target.value)} required maxLength={120}/></div>
        <div className="space-y-2"><Label htmlFor="brideName">Nama mempelai wanita</Label><Input id="brideName" value={brideName} onChange={e=>setBrideName(e.target.value)} required maxLength={120}/></div>
        <div className="space-y-2 md:col-span-2"><Label htmlFor="slug">Slug publik</Label><Input id="slug" value={slug||generatedSlug} onChange={e=>setSlug(e.target.value)} placeholder="nama-pria-nama-wanita" maxLength={80}/><p className="text-xs text-muted-foreground">Slug unik dan stabil.</p></div>
      </CardContent>
    </Card>
    <div className="flex justify-end"><Button type="submit" disabled={loading||!themeId||!groomName.trim()||!brideName.trim()}>{loading&&<Loader2 className="size-4 animate-spin"/>}Buat draft</Button></div>
  </form>;
}