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
import { ThemeSectionLivePreview } from "@/components/admin/theme-section-live-preview";

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
function readDesign(json: string): Record<string, any> {
 try {
  const parsed=JSON.parse(json);
  return parsed && typeof parsed==="object" && !Array.isArray(parsed) && parsed.design && typeof parsed.design==="object" ? parsed.design : {};
 } catch { return {}; }
}
function writeDesign(json: string, path: "background"|"typography"|"layout"|"button"|"image", key: string, value: unknown): string {
 let parsed: Record<string, any> = {};
 try { const current=JSON.parse(json); if(current && typeof current==="object" && !Array.isArray(current)) parsed=current; } catch {}
 const design=parsed.design && typeof parsed.design==="object" ? parsed.design : {};
 const group=design[path] && typeof design[path]==="object" ? design[path] : {};
 parsed.design={...design,[path]:{...group,[key]:value}};
 return JSON.stringify(parsed,null,2);
}
function EditorForm({draft,setDraft,editing,busy,error,onSubmit,onCancel}:{draft:ReturnType<typeof blank>;setDraft:React.Dispatch<React.SetStateAction<ReturnType<typeof blank>>>;editing:string|null;busy:boolean;error:string;onSubmit:(event:React.FormEvent<HTMLFormElement>)=>void;onCancel:()=>void}){
 const [previewMode,setPreviewMode]=useState<"desktop"|"mobile">("desktop");
 const update=<K extends keyof ReturnType<typeof blank>>(key:K,value:ReturnType<typeof blank>[K])=>setDraft(current=>({...current,[key]:value}));
 return <form onSubmit={onSubmit} className="space-y-4">
  <h4 className="font-medium">{editing?"Edit section":"Section baru"}</h4>
  <div className="grid gap-4 sm:grid-cols-2">
   <div className="space-y-2"><Label htmlFor="section-key">Section key</Label><Input id="section-key" value={draft.section_key} onChange={e=>update("section_key",e.target.value)} placeholder="contoh: cover" pattern="[a-z][a-z0-9_-]*" required maxLength={80}/></div>
   <div className="space-y-2"><Label htmlFor="section-type">Tipe section</Label><Select value={draft.section_type} onValueChange={value=>update("section_type",value)}><SelectTrigger id="section-type"><SelectValue/></SelectTrigger><SelectContent>{types.map(type=><SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
  </div>
  <div className="space-y-3 rounded-lg border p-4">
   <div className="flex flex-wrap items-center justify-between gap-2"><div><h5 className="text-sm font-semibold">Live preview</h5><p className="text-xs text-muted-foreground">Renderer section asli dengan data contoh.</p></div><div className="flex gap-1"><Button type="button" size="sm" variant={previewMode==="desktop"?"default":"outline"} onClick={()=>setPreviewMode("desktop")}>Desktop</Button><Button type="button" size="sm" variant={previewMode==="mobile"?"default":"outline"} onClick={()=>setPreviewMode("mobile")}>Mobile</Button></div></div>
   <div className={previewMode==="mobile"?"mx-auto max-h-[640px] w-[390px] max-w-full overflow-auto rounded-xl border-4 border-foreground/15 bg-background shadow-inner":"w-full overflow-hidden rounded-md border bg-background"}>
    <ThemeSectionLivePreview sectionKey={draft.section_key || "preview"} sectionType={draft.section_type} content={(() => { try { const value=JSON.parse(draft.default_content); return value && typeof value==="object" && !Array.isArray(value) ? value : {}; } catch { return {}; } })()} />
   </div>
  </div>
  <div className="space-y-3 rounded-lg border p-4">
   <div><h5 className="text-sm font-semibold">Pengaturan desain</h5><p className="text-xs text-muted-foreground">Tersimpan dalam properti design. Nilai yang kosong memakai styling bawaan section.</p></div>
   {(() => { const design=readDesign(draft.default_content); const bg=design.background??{}; const typo=design.typography??{}; const layout=design.layout??{}; const button=design.button??{}; const image=design.image??{}; return <>
    <div className="grid gap-3 sm:grid-cols-2">
     <div className="space-y-1"><Label>Jenis background</Label><Select value={bg.type??"none"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"background","type",value==="none"?undefined:value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">Default</SelectItem><SelectItem value="color">Warna</SelectItem><SelectItem value="image">Gambar</SelectItem><SelectItem value="gradient">Gradient</SelectItem></SelectContent></Select></div>
     <div className="space-y-1"><Label>Warna / URL / gradient</Label><Input value={bg.value??""} placeholder="#f8f4ef atau https://..." onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"background","value",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Posisi gambar</Label><Input value={bg.position??"center"} placeholder="center" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"background","position",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Ukuran gambar</Label><Select value={bg.size??"cover"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"background","size",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="cover">Cover</SelectItem><SelectItem value="contain">Contain</SelectItem><SelectItem value="auto">Auto</SelectItem></SelectContent></Select></div>
     <div className="space-y-1"><Label>Overlay gelap (0–1)</Label><Input type="number" min="0" max="1" step="0.05" value={bg.overlay??0} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"background","overlay",Number(event.target.value))}))}/></div>
     <div className="space-y-1"><Label>Font family</Label><Input value={typo.fontFamily??""} placeholder="Georgia, serif" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","fontFamily",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Ukuran heading (px)</Label><Input type="number" min="8" max="120" value={typo.headingFontSize??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","headingFontSize",Number(event.target.value))}))}/></div>
     <div className="space-y-1"><Label>Ukuran body (px)</Label><Input type="number" min="8" max="48" value={typo.bodyFontSize??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","bodyFontSize",Number(event.target.value))}))}/></div>
     <div className="space-y-1"><Label>Font heading</Label><Input value={typo.headingFontFamily??""} placeholder="Georgia, serif" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","headingFontFamily",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Font body</Label><Input value={typo.bodyFontFamily??""} placeholder="Arial, sans-serif" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","bodyFontFamily",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Warna heading</Label><Input value={typo.headingColor??""} placeholder="#2b2927" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","headingColor",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Warna body</Label><Input value={typo.bodyColor??""} placeholder="#5b5550" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","bodyColor",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Alignment heading</Label><Select value={typo.headingAlignment??"center"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","headingAlignment",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="left">Kiri</SelectItem><SelectItem value="center">Tengah</SelectItem><SelectItem value="right">Kanan</SelectItem></SelectContent></Select></div>
     <div className="space-y-1"><Label>Alignment body</Label><Select value={typo.bodyAlignment??"center"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","bodyAlignment",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="left">Kiri</SelectItem><SelectItem value="center">Tengah</SelectItem><SelectItem value="right">Kanan</SelectItem></SelectContent></Select></div>
     <div className="space-y-1"><Label>Warna font</Label><Input value={typo.color??""} placeholder="#2b2927" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","color",event.target.value)}))}/></div>
     <div className="space-y-1"><Label>Ketebalan font</Label><Select value={String(typo.fontWeight??600)} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","fontWeight",Number(value))}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{[300,400,500,600,700,800].map(weight=><SelectItem key={weight} value={String(weight)}>{weight}</SelectItem>)}</SelectContent></Select></div>
     <div className="space-y-1"><Label>Alignment teks</Label><Select value={typo.alignment??"center"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"typography","alignment",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="left">Kiri</SelectItem><SelectItem value="center">Tengah</SelectItem><SelectItem value="right">Kanan</SelectItem></SelectContent></Select></div>
     <div className="space-y-1"><Label>Padding atas (px)</Label><Input type="number" min="0" max="400" value={layout.paddingTop??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"layout","paddingTop",Number(event.target.value))}))}/></div>
     <div className="space-y-1"><Label>Padding bawah (px)</Label><Input type="number" min="0" max="400" value={layout.paddingBottom??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"layout","paddingBottom",Number(event.target.value))}))}/></div>
    <div className="sm:col-span-2 mt-2 border-t pt-3"><h6 className="text-sm font-semibold">Tombol & tautan</h6><p className="text-xs text-muted-foreground">Berlaku untuk tombol dan tautan aksi di dalam section ini.</p></div>
    <div className="space-y-1"><Label>Warna background tombol</Label><Input value={button.backgroundColor??""} placeholder="#6b5144" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","backgroundColor",event.target.value)}))}/></div>
    <div className="space-y-1"><Label>Warna teks tombol</Label><Input value={button.textColor??""} placeholder="#ffffff" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","textColor",event.target.value)}))}/></div>
    <div className="space-y-1"><Label>Warna border tombol</Label><Input value={button.borderColor??""} placeholder="#6b5144" onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","borderColor",event.target.value)}))}/></div>
    <div className="space-y-1"><Label>Radius tombol (px)</Label><Input type="number" min="0" max="48" value={button.borderRadius??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","borderRadius",Number(event.target.value))}))}/></div>
    <div className="space-y-1"><Label>Ukuran teks tombol (px)</Label><Input type="number" min="10" max="32" value={button.fontSize??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","fontSize",Number(event.target.value))}))}/></div>
    <div className="space-y-1"><Label>Padding horizontal (px)</Label><Input type="number" min="0" max="64" value={button.paddingX??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","paddingX",Number(event.target.value))}))}/></div>
    <div className="space-y-1"><Label>Padding vertikal (px)</Label><Input type="number" min="0" max="40" value={button.paddingY??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"button","paddingY",Number(event.target.value))}))}/></div>
    <div className="sm:col-span-2 mt-2 border-t pt-3"><h6 className="text-sm font-semibold">Gambar</h6><p className="text-xs text-muted-foreground">Kontrol ini terutama memengaruhi gambar galeri pada section terkait.</p></div>
    <div className="space-y-1"><Label>Rasio gambar</Label><Select value={image.aspectRatio??"square"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"image","aspectRatio",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="square">Persegi (1:1)</SelectItem><SelectItem value="portrait">Portrait (3:4)</SelectItem><SelectItem value="landscape">Landscape (4:3)</SelectItem></SelectContent></Select></div>
    <div className="space-y-1"><Label>Object fit</Label><Select value={image.objectFit??"cover"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"image","objectFit",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="cover">Cover</SelectItem><SelectItem value="contain">Contain</SelectItem></SelectContent></Select></div>
    <div className="space-y-1"><Label>Radius gambar (px)</Label><Input type="number" min="0" max="48" value={image.borderRadius??""} onChange={event=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"image","borderRadius",Number(event.target.value))}))}/></div>
    <div className="space-y-1"><Label>Posisi gambar</Label><Select value={image.objectPosition??"center"} onValueChange={value=>setDraft(current=>({...current,default_content:writeDesign(current.default_content,"image","objectPosition",value)}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="center">Tengah</SelectItem><SelectItem value="top">Atas</SelectItem><SelectItem value="bottom">Bawah</SelectItem><SelectItem value="left">Kiri</SelectItem><SelectItem value="right">Kanan</SelectItem></SelectContent></Select></div>

    </div>
   </>; })()}
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
