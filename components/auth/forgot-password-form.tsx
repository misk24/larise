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
import { requestPasswordReset } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid."),
});

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Email tidak valid.");
      return;
    }
    setIsSubmitting(true);

    const result = await requestPasswordReset(email);

    if (result?.error) {
      toast.error(result.error);
      if (result?.shouldRedirectToLogin) {
        router.replace("/login");
      }
      setIsSubmitting(false);
      return;
    }

    toast.success("Link reset password sudah dikirim ke email kamu.");
    setIsSent(true);
    setIsSubmitting(false);
  }

  return (
    <Card className="w-full max-w-md border-none bg-primary-foreground">
      <CardHeader className="flex flex-col items-center gap-4 mb-4">
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription className="text-center">
          Masukkan email untuk menerima link reset password
        </CardDescription>
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
              disabled={isSubmitting || isSent}
            />
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex flex-col gap-3">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || isSent}
          >
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
          {isSent ? (
            <p className="text-xs text-muted-foreground text-center">
              Sudah terkirim. Silakan cek inbox atau folder spam.
            </p>
          ) : null}
        </CardFooter>
      </form>

      <div className="w-full px-6 pb-6">
        <p className="text-sm text-muted-foreground text-center">
          Ingat password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Kembali ke login
          </Link>
        </p>
      </div>
    </Card>
  );
}
