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
// import { signInWithEmail, signInWithGoogle } from "@/lib/actions/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

        toast.success("Berhasil masuk!")

        if (profile?.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }


  // async function handleGoogle() {
  //   setIsLoading(true)

  //   try {
  //     const result = await signInWithGoogle()

  //     if (!result) {
  //       throw new Error("No response from authentication service")
  //     }

  //     if ("error" in result) {
  //       toast.error(result.error)
  //       setIsLoading(false)
  //       return
  //     }

  //     // redirect ke Google terjadi di server
  //   } catch (error) {
  //     console.error("Google sign in error:", error)
  //     toast.error("Gagal login dengan Google.")
  //     setIsLoading(false)
  //   }
  // }

  return (
    <Card className="w-full max-w-md border-none bg-primary-foreground">
      <CardHeader className="mb-4 text-center">
        <CardTitle className="text-2xl font-logo font-normal tracking-widest">{logo}</CardTitle>
        <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
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
        
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Masuk
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </form>

      <div className="w-full px-6 space-y-4">
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <p>or</p>
          <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" size="lg" className="w-full gap-2">
          <Icon icon="logos:google-icon" className="w-4 h-4" />
          <span>Continue with google</span>
        </Button>
      </div>
    </Card>
  )
}
