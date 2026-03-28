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
import { useIsMobile } from "@/hooks/use-mobile";
import { requestPasswordReset } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
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
  const isMobile = useIsMobile();

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
    <Card
      className={cn(
        "w-full max-w-md bg-sidebar",
        isMobile ? " border-none shadow-none" : "",
      )}
    >
      <CardHeader className="flex flex-col items-center gap-4 mb-4">
        <CardTitle>
          <Logo />
        </CardTitle>

        <CardDescription>
          Masukkan email untuk menerima link reset password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || isSent}
          >
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
          </Button>

          {isSent ? (
            <div className="text-xs text-muted-foreground text-center">
              Sudah terkirim. Silakan cek inbox atau folder spam.
            </div>
          ) : null}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground">
          Ingat password?
          <Button variant="link" className="-ml-2" asChild>
            <Link href="/login" className="text-primary">
              Kembali ke login
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
