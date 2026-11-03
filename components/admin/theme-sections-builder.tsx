"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Section = { id: string; section_key: string; section_type: string; position: number; default_content: Record<string, unknown>; is_required: boolean; is_visible: boolean };
const types = ["cover","opening","quote","couple","event","location","gallery","rsvp","gift","closing"];
const blank = () => ({ section_key: "", section_type: "cover", default_content: "{}", is_required: false, is_visible: true });
export default function ThemeSectionsBuilder({ themeId, initialSections }: { themeId: string; initialSections: Section[] }) {
  const router = useRouter();
  const [sections,setSections] = useState(initialSections);
  const [draft,setDraft] = useState(blank()), [editing,setEditing] = useState<string|null>(null);
  const [busy,setBusy] = useState(false), [error,setError] = useState("");
  const [expanded,setExpanded] = useState<string|null>(null);
  const base = `/api/admin/themes/${themeId}/sections`;
  function edit(section: Section) {
    setEditing(section.id); setExpanded(section.id);
    setDraft({ section_key: section.section_key, section_type: section.section_type, default_content: JSON.stringify(section.default_content ?? {},null,2), is_required: section.is_required, is_visible: section.is_visible });
    setError("");
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    let content: unknown;
    try { content=JSON.parse(draft.default_content); } catch { setError("Konten default harus berupa JSON yang valid."); return; }
    if (!content || typeof content!=="object" || Array.isArray(content)) { setError("Konten default harus berupa objek JSON."); return; }
    setBusy(true);
    try {
      const response=await fetch(editing?`${base}/${editing}`:base,{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...draft,default_content:content})});
      const result=await response.json(); if(!response.ok) throw new Error(result.error||"Section gagal disimpan.");
      if(editing) setSections(current=>current.map(item=>item.id===editing?result:item));
      else setSections(current=>[...current,result].sort((a,b)=>a.position-b.position));
      setEditing(null);setDraft(blank());setExpanded(null);router.refresh();
    } catch(cause){setError(cause instanceof Error?cause.message:"Terjadi kesalahan.");}
    finally{setBusy(false);}
  }
  async function remove(section: Section) {
    if(!window.confirm(`Hapus section "${section.section_key}"? Data konten pada template ini akan ikut dihapus.`))return;
    setBusy(true);setError("");
    try{const response=await fetch(`${base}/${section.id}`,{method:"DELETE"});const result=await response.json();if(!response.ok)throw new Error(result.error||"Section gagal dihapus.");setSections(current=>current.filter(item=>item.id!==section.id));router.refresh();}
    catch(cause){setError(cause instanceof Error?cause.message:"Terjadi kesalahan.");}finally{setBusy(false);}
  }
  async function move(index:number,delta:number) {
    const target=index+delta;if(target<0||target>=sections.length||busy)return;
    const next=[...sections];[next[index],next[target]]=[next[target],next[index]];
    setBusy(true);setError("");
    try{const response=await fetch(`${base}/reorder`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({section_ids:next.map(item=>item.id)})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Urutan section gagal disimpan.");setSections(next.map((item,position)=>({...item,position})));router.refresh();}
    catch(cause){setError(cause instanceof Error?cause.message:"Terjadi kesalahan.");}
    finally{setBusy(false);}
  }
  function addNew(){setEditing(null);setDraft(blank());setExpanded("new");setError("");}
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Struktur section</h3><p className="text-sm text-muted-foreground">{sections.length} section · urutan tampil pada undangan</p></div><Button type="button" size="sm" onClick={addNew}><Plus className="mr-2 size-4"/>Tambah section</Button></div>
    {error&&!expanded?<p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>:null}
    <ol className="space-y-2">
      {sections.map((section,index)=><li key={section.id} className="rounded-lg border">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <GripVertical className="size-4 text-muted-foreground"/>
          <span className="w-7 text-center text-xs tabular-nums text-muted-foreground">{index+1}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{section.section_key}</p><p className="text-xs text-muted-foreground capitalize">{section.section_type} · {section.is_visible?"Tampil":"Disembunyikan"}{section.is_required?" · Wajib":""}</p></div>
          <div className="flex items-center gap-1">
            <Button type="button" size="icon" variant="ghost" aria-label={`Naikkan ${section.section_key}`} disabled={busy||index===0} onClick={()=>move(index,-1)}><ArrowUp className="size-4"/></Button>
            <Button type="button" size="icon" variant="ghost" aria-label={`Turunkan ${section.section_key}`} disabled={busy||index===sections.length-1} onClick={()=>move(index,1)}><ArrowDown className="size-4"/></Button>
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={()=>edit(section)}>Edit</Button>
            <Button type="button" size="icon" variant="ghost" aria-label={`Hapus ${section.section_key}`} disabled={busy} onClick={()=>remove(section)}><Trash2 className="size-4 text-destructive"/></Button>
          </div>
        </div>
        {expanded===section.id?<div className="border-t p-4"><EditorForm draft={draft} setDraft={setDraft} editing={editing} busy={busy} error={error} onSubmit={save} onCancel={()=>{setExpanded(null);setEditing(null);setError("");}}/></div>:null}
      </li>)}
    </ol>
    {expanded==="new"?<div className="rounded-lg border p-4"><EditorForm draft={draft} setDraft={setDraft} editing={editing} busy={busy} error={error} onSubmit={save} onCancel={()=>{setExpanded(null);setError("");}}/></div>:null}
    {!sections.length?<p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada section. Tambahkan section pertama untuk membangun struktur tema.</p>:null}
  </div>;
}
function EditorForm({draft,setDraft,editing,busy,error,onSubmit,onCancel}:{draft:ReturnType<typeof blank>;setDraft:React.Dispatch<React.SetStateAction<ReturnType<typeof blank>>>;editing:string|null;busy:boolean;error:string;onSubmit:(event:React.FormEvent<HTMLFormElement>)=>void;onCancel:()=>void}){
 const update=<K extends keyof ReturnType<typeof blank>>(key:K,value:ReturnType<typeof blank>[K])=>setDraft(current=>({...current,[key]:value}));
 return <form onSubmit={onSubmit} className="space-y-4">
  <h4 className="font-medium">{editing?"Edit section":"Section baru"}</h4>
  <div className="grid gap-4 sm:grid-cols-2">
   <div className="space-y-2"><Label htmlFor="section-key">Section key</Label><Input id="section-key" value={draft.section_key} onChange={e=>update("section_key",e.target.value)} placeholder="contoh: cover" pattern="[a-z][a-z0-9_-]*" required maxLength={80}/></div>
   <div className="space-y-2"><Label htmlFor="section-type">Tipe section</Label><Select value={draft.section_type} onValueChange={value=>update("section_type",value)}><SelectTrigger id="section-type"><SelectValue/></SelectTrigger><SelectContent>{types.map(type=><SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
  </div>
  <div className="space-y-2"><Label htmlFor="section-content">Konten default (JSON)</Label><Textarea id="section-content" value={draft.default_content} onChange={e=>update("default_content",e.target.value)} rows={10} className="font-mono text-xs" spellCheck={false}/><p className="text-xs text-muted-foreground">Objek JSON maksimal 64 KB. Struktur field mengikuti renderer section terkait.</p></div>
  <div className="flex flex-wrap gap-6 rounded-md bg-muted/40 p-3">
   <div className="flex items-center gap-2"><Switch id="section-visible" checked={draft.is_visible} onCheckedChange={value=>update("is_visible",value)}/><Label htmlFor="section-visible">Tampilkan section</Label></div>
   <div className="flex items-center gap-2"><Switch id="section-required" checked={draft.is_required} onCheckedChange={value=>update("is_required",value)}/><Label htmlFor="section-required">Section wajib</Label></div>
  </div>
  {error?<p role="alert" className="text-sm text-destructive">{error}</p>:null}
  <div className="flex flex-wrap gap-2"><Button type="submit" disabled={busy}><Save className="mr-2 size-4"/>{busy?"Menyimpan...":"Simpan section"}</Button><Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Batal</Button></div>
 </form>;
}
