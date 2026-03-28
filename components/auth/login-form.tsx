"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { signInWithEmail } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Handle error dari query params
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");

    if (error === "provider_mismatch") {
      toast.error(
        `Email ini sudah terdaftar dengan ${provider === "google" ? "Google" : "Email"}. Silakan login dengan metode tersebut.`,
      );
    } else if (error === "oauth") {
      toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
    } else if (error === "profile_creation") {
      toast.error("Terjadi kesalahan saat membuat profil. Silakan coba lagi.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Data tidak valid.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      const result = await signInWithEmail(email, password);

      if (result?.error) {
        // Transform Supabase error message menjadi lebih user-friendly
        let errorMessage = result.error;

        // Case 1: Email/password salah
        if (result.error.includes("Invalid login credentials")) {
          errorMessage = "Email atau password salah. Silakan coba lagi.";
        }
        // Case 2: Akun terdaftar dengan metode lain (Google OAuth)
        // Error message sudah di-generate di auth.ts dengan jelas

        toast.error(errorMessage);
        setIsSubmitLoading(false);
        return;
      }
      // Jika tidak ada error, redirect akan terjadi otomatis
      // Tidak perlu handle di sini karena signInWithEmail() sudah redirect
    } catch (err: unknown) {
      // Ignore NextJS redirect error (bukan error sebenarnya)
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        return;
      }

      console.error(err);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitLoading(false);
    }
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        "w-full max-w-md bg-sidebar",
        isMobile ? "border-none shadow-none" : "",
      )}
    >
      <CardHeader className="flex flex-col items-center gap-4 mb-4">
        <CardTitle>
          <Logo />
        </CardTitle>

        <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-2 hover:text-primary-foreground"
          onClick={handleGoogle}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <Icon icon="logos:google-icon" className="size-4" />
          )}
          <span>
            {isGoogleLoading ? "Redirecting..." : "Masuk dengan Google"}
          </span>
        </Button>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <p className="text-xs">atau</p>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitLoading}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Lupa password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitLoading}
          >
            {isSubmitLoading && (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            )}
            Masuk
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground">
          Belum punya akun?
          <Button variant="link" className="-ml-2" asChild>
            <Link href="/register" className="text-primary">
              Daftar sekarang
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
