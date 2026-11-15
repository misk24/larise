"use client";

import { AuthHeading } from "@/components/landing/ui/auth-heading";
import { LandingButton } from "@/components/landing/ui/button";
import { Field, focusField, getFieldErrors, PasswordField } from "@/components/landing/ui/field";
import { OAuthButton } from "@/components/landing/ui/oauth-button";
import { signInWithEmail } from "@/lib/actions/auth";
import { loginSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    // Handle error dari query params
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");

    if (error === "provider_mismatch") {
      toast.error(
        `Email ini sudah terdaftar dengan ${provider === "google" ? "Google" : "Email"}. Silakan login dengan metode tersebut.`,
      );
    } else if (error === "account_not_found") {
      toast.error("Akun belum terdaftar. Silakan daftar terlebih dahulu.");
    } else if (error === "oauth") {
      toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
    } else if (error === "profile_creation" || error === "profile_lookup") {
      toast.error("Terjadi kesalahan saat memuat profil. Silakan coba lagi.");
    } else if (error === "verification_failed") {
      toast.error("Verifikasi email gagal atau tautannya sudah kedaluwarsa. Minta tautan baru.");
    } else if (error === "invalid_callback") {
      toast.error("Tautan autentikasi tidak valid. Silakan coba login kembali.");
    }
  }, [searchParams]);

  const clearError = (key: string) => setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors = getFieldErrors(validation.error.issues);
      setErrors(fieldErrors);
      focusField(Object.keys(fieldErrors)[0]);
      return;
    }
    setErrors({});

    setIsSubmitLoading(true);

    try {
      const result = await signInWithEmail(email, password, redirectTo);

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
      if (result?.success && result.redirectTo) {
        router.replace(result.redirectTo);
        return;
      }
    } catch (err: unknown) {
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
        redirectTo: `${window.location.origin}/auth/callback?intent=login${
          redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : ""
        }`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  }

  return (
    <>
      <AuthHeading title="Masuk" description="Masuk ke akun Anda untuk melanjutkan." />

      <OAuthButton onClick={handleGoogle} loading={isGoogleLoading}>
        Masuk dengan Google
      </OAuthButton>

      <div aria-hidden="true" className="my-6 flex items-center gap-4 text-sm text-ink-soft">
        <span className="h-px flex-1 bg-fg/15" />
        atau
        <span className="h-px flex-1 bg-fg/15" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          disabled={isSubmitLoading}
          error={errors.email}
        />

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
          disabled={isSubmitLoading}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-ink-soft underline-offset-4 transition-colors hover:text-gold-deep hover:underline">
            Lupa password?
          </Link>
        </div>

        <LandingButton type="submit" size="lg" className="w-full" disabled={isSubmitLoading}>
          {isSubmitLoading && <Loader2Icon aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
          Masuk
        </LandingButton>
      </form>

      <p className="mt-8 text-sm text-ink-soft">
        Belum punya akun?{" "}
        <Link href="/register" className="text-fg underline underline-offset-4 transition-colors hover:text-gold-deep">
          Daftar sekarang
        </Link>
      </p>
    </>
  );
}
