"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signUpWithEmail } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/client"
import { Icon } from "@iconify/react"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak sama")
      return
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setIsSubmitLoading(true)

    try {
      const result = await signUpWithEmail(email, password)

      if (result?.error) {
        toast.error(result.error)
        
        if (result?.shouldRedirectToLogin) {
          router.replace("/login")
          return
        }

        setIsSubmitLoading(false)
        return
      }

      if (result?.needsVerification) {
        router.push("/auth/verify")
        return
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  async function handleGoogle() {
    setIsGoogleLoading(true)
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  
    if (error) {
      toast.error(error.message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-none bg-background">
      <CardHeader className="flex flex-col items-center gap-4 mb-4">
        <CardTitle><Logo /></CardTitle>
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
                disabled={isSubmitLoading}
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
                  disabled={isSubmitLoading}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPasswordVisible(prevState => !prevState)}
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">
                    {isPasswordVisible ? "Hide password" : "Show password"}
                  </span>
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
                  disabled={isSubmitLoading}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsConfirmPasswordVisible(prevState => !prevState)}
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">
                    {isConfirmPasswordVisible ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
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
            <p className="text-xs">atau</p>
            <Separator className="flex-1" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            className="w-full gap-2 hover:text-primary-foreground"
            onClick={handleGoogle}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="logos:google-icon" className="size-4"/>
            )}
            <span>
              {isGoogleLoading ? "Redirecting..." : "Daftar dengan Google"}
            </span>
          </Button>
        </div>
    </Card>
  )
}
