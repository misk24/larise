"use client";

import { AuthHeading } from "@/components/landing/ui/auth-heading";
import { LandingButton } from "@/components/landing/ui/button";
import { Field, focusField, getFieldErrors, PasswordField } from "@/components/landing/ui/field";
import { OAuthButton } from "@/components/landing/ui/oauth-button";
import { signUpWithEmail } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const clearError = (key: string) => setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      const fieldErrors = getFieldErrors(validation.error.issues);
      setErrors(fieldErrors);
      focusField(Object.keys(fieldErrors)[0]);
      return;
    }
    setErrors({});

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
        router.push("/verify");
        return;
      }

      if (result?.needsVerification === false) {
        router.replace("/dashboard");
        return;
      }

      toast.error("Registrasi belum dapat diselesaikan. Silakan coba lagi.");
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
        redirectTo: `${window.location.origin}/auth/callback?intent=signup`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  }

  return (
    <>
      <AuthHeading title="Daftar" description="Mulai buat undangan pernikahan digital Anda." />

      <OAuthButton onClick={handleGoogle} loading={isGoogleLoading}>
        Daftar dengan Google
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
          disabled={isSubmitLoading}
          error={errors.password}
        />

        <PasswordField
          id="confirmPassword"
          label="Konfirmasi Password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearError("confirmPassword");
          }}
          disabled={isSubmitLoading}
          error={errors.confirmPassword}
        />

        <LandingButton type="submit" size="lg" className="w-full" disabled={isSubmitLoading}>
          {isSubmitLoading && <Loader2Icon aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
          Daftar
        </LandingButton>
      </form>

      <p className="mt-8 text-sm text-ink-soft">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-fg underline underline-offset-4 transition-colors hover:text-gold-deep">
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
