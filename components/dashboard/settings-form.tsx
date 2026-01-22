"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Profile } from "@/types/database"
import type { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

interface SettingsFormProps {
  user: User
  profile: Profile | null
}

// export function SettingsForm() {
export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq("id", user.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Profil berhasil diperbarui!")
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // <form>
    <form onSubmit={handleSubmit}>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui informasi akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value="" disabled className="bg-muted" />
            <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
            {/* <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p> */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              // value="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap Anda"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            {/* <Input id="phone" value="" placeholder="08123456789" /> */}
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
