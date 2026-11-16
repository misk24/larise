"use client";
import { RefreshCw,TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function AdminTableError({title="Data gagal dimuat",description="Terjadi kendala saat mengambil data. Silakan coba lagi."}:{title?:string;description?:string}){
 const router=useRouter();return <div role="alert" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive-muted px-6 py-10 text-center"><TriangleAlert className="size-6 text-destructive" aria-hidden="true"/><div className="space-y-1"><p className="font-medium">{title}</p><p className="max-w-md text-sm text-muted-foreground">{description}</p></div><Button type="button" variant="outline" size="sm" onClick={()=>router.refresh()}><RefreshCw className="mr-2 size-4"/>Coba lagi</Button></div>;
}
export function AdminRouteError({reset}:{reset:()=>void}){return <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center"><TriangleAlert className="size-7 text-destructive" aria-hidden="true"/><h2 className="text-lg font-semibold">Halaman gagal dimuat</h2><p className="max-w-md text-sm text-muted-foreground">Terjadi kesalahan saat memuat halaman admin. Coba muat ulang halaman ini.</p><Button onClick={reset} variant="outline"><RefreshCw className="mr-2 size-4"/>Coba lagi</Button></div>;}
