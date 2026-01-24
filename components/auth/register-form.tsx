"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logo } from "@/constants/logo"
import { createClient } from "@/lib/supabase/client"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import { Icon } from "@iconify/react"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Password tidak sama")
      return
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        if (data.user.identities?.length === 0) {
          toast.error("Email sudah terdaftar. Silakan masuk.")
          return
        }

        toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.")
        router.push("/login")
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-none bg-background">
      <CardHeader className="mb-4 text-center">
        <CardTitle className="text-2xl font-logo font-normal tracking-widest">{logo}</CardTitle>
        <CardDescription>Mulai buat undangan pernikahan digital Anda</CardDescription>
      </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPasswordVisible(prevState => !prevState)}
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">{isPasswordVisible ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsConfirmPasswordVisible(prevState => !prevState)}
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">{isConfirmPasswordVisible ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-8 flex flex-col gap-4">
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Daftar
            </Button>
          </CardFooter>
        </form>

        <div className="w-full px-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>or</p>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" size="lg" className="w-full">
            <Icon icon="logos:google-icon" className="w-4 h-4" />
            <span>Sign up with google</span>
          </Button>
        </div>
    </Card>
  )
}
