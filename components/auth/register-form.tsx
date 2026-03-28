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
import { signUpWithEmail } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("Email tidak valid."),
    password: z.string().min(6, "Password minimal 6 karakter."),
    confirmPassword: z.string().min(6, "Password minimal 6 karakter."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama.",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const isMobile = useIsMobile();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Data tidak valid.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      const result = await signUpWithEmail(email, password);

      if (result?.error) {
        toast.error(result.error);

        if (result?.shouldRedirectToLogin) {
          router.replace("/login");
          return;
        }

        setIsSubmitLoading(false);
        return;
      }

      if (result?.needsVerification) {
        router.push("/auth/verify");
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
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

        <CardDescription>
          Mulai buat undangan pernikahan digital Anda
        </CardDescription>
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
            {isGoogleLoading ? "Redirecting..." : "Daftar dengan Google"}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitLoading}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setShowConfirmPassword((prevState) => !prevState)
                }
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
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
            Daftar
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground">
          Sudah punya akun?
          <Button variant="link" className="-ml-2" asChild>
            <Link href="/login" className="text-primary">
              Masuk di sini
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
