"use client";

import { AuthHeading } from "@/components/landing/ui/auth-heading";
import { LandingButton } from "@/components/landing/ui/button";
import { Field, focusField } from "@/components/landing/ui/field";
import { requestPasswordReset } from "@/lib/actions/auth";
import { emailSchema } from "@/lib/auth/validation";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setEmailError(validation.error.issues[0]?.message ?? "Email tidak valid.");
      focusField("email");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset(email);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Jika email terdaftar untuk login dengan password, link reset akan dikirim. Silakan cek inbox atau folder spam.");
      setIsSent(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast.error("Permintaan reset belum dapat diproses. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AuthHeading title="Lupa password" description="Masukkan email untuk menerima link reset password." />

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
            setEmailError("");
          }}
          disabled={isSubmitting || isSent}
          error={emailError}
        />

        <LandingButton type="submit" size="lg" className="w-full" disabled={isSubmitting || isSent}>
          {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
        </LandingButton>

        {isSent ? (
          <p role="status" className="border-l-2 border-gold-deep pl-4 text-sm leading-6 text-ink-soft">
            Sudah terkirim. Silakan cek inbox atau folder spam.
          </p>
        ) : null}
      </form>

      <p className="mt-8 text-sm text-ink-soft">
        Ingat password?{" "}
        <Link href="/login" className="text-fg underline underline-offset-4 transition-colors hover:text-gold-deep">
          Kembali ke login
        </Link>
      </p>
    </>
  );
}
