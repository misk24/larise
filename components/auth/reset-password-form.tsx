"use client";

import { AuthHeading } from "@/components/landing/ui/auth-heading";
import { LandingButton } from "@/components/landing/ui/button";
import { focusField, getFieldErrors, PasswordField } from "@/components/landing/ui/field";
import { passwordResetSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExchanging, setIsExchanging] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const tokenType = searchParams.get("type");
    let isMounted = true;

    async function validateRecoveryLink() {
      let validationError: Error | null = null;

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          validationError = error;
        } else if (tokenHash && tokenType === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          validationError = error;
        } else {
          // Supabase may consume URL-fragment tokens while initializing the browser
          // client, so the fragment is not guaranteed to remain available here.
          // Accept only if Supabase has established a valid session.
          const { data, error } = await supabase.auth.getSession();
          validationError = error;
          if (!validationError && !data.session) {
            validationError = new Error("No valid recovery session was established.");
          }
        }
      } catch (error) {
        validationError = error instanceof Error ? error : new Error("Recovery link validation failed.");
      }

      if (!isMounted) return;

      if (validationError) {
        // Keep token values out of logs and show a safe, actionable message to users.
        console.error("Password recovery link validation failed:", validationError.message);
        toast.error("Link reset tidak valid atau sudah kedaluwarsa.");
        setIsReady(false);
      } else {
        setIsReady(true);
      }

      setIsExchanging(false);
    }

    void validateRecoveryLink();

    return () => {
      isMounted = false;
    };
  }, [searchParams, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = passwordResetSchema.safeParse({
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

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Password belum dapat diperbarui. Silakan coba lagi.");
      console.error("Password update failed:", error.message);
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut();

    toast.success("Password berhasil diperbarui. Silakan login kembali.");
    setIsComplete(true);
    setIsSubmitting(false);

    setTimeout(() => {
      router.push("/login");
    }, 800);
  }

  const isFormDisabled = isSubmitting || isExchanging || !isReady || isComplete;
  const clearError = (key: string) => setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

  return (
    <>
      <AuthHeading title="Atur ulang password" description="Buat password baru untuk akun Anda." />

      {isExchanging ? (
        <p role="status" className="text-sm text-ink-soft">
          Memvalidasi link reset...
        </p>
      ) : null}

      {!isExchanging && !isReady ? (
        <div role="alert" className="space-y-3 border-l-2 border-danger pl-4">
          <p className="text-sm leading-6 text-fg">Link reset tidak valid atau sudah kedaluwarsa.</p>
          <Link href="/forgot-password" className="text-sm text-fg underline underline-offset-4 transition-colors hover:text-gold-deep">
            Kirim ulang link reset
          </Link>
        </div>
      ) : null}

      {isReady ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <PasswordField
            id="password"
            label="Password Baru"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
            error={errors.confirmPassword}
          />

          <LandingButton type="submit" size="lg" className="w-full" disabled={isFormDisabled}>
            {isSubmitting ? "Menyimpan..." : "Simpan Password"}
          </LandingButton>
        </form>
      ) : null}

      <p className="mt-8 text-sm text-ink-soft">
        Ingat password?{" "}
        <Link href="/login" className="text-fg underline underline-offset-4 transition-colors hover:text-gold-deep">
          Kembali ke login
        </Link>
      </p>
    </>
  );
}
