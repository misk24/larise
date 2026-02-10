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
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExchanging, setIsExchanging] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setIsExchanging(false);
      setIsReady(false);
      return;
    }

    const resetCode = code;
    let isMounted = true;

    async function exchangeCode(codeValue: string) {
      const { error } = await supabase.auth.exchangeCodeForSession(codeValue);

      if (!isMounted) return;

      if (error) {
        toast.error("Link reset tidak valid atau sudah kedaluwarsa.");
        setIsReady(false);
      } else {
        setIsReady(true);
      }

      setIsExchanging(false);
    }

    exchangeCode(resetCode);

    return () => {
      isMounted = false;
    };
  }, [searchParams, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak sama.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("Password berhasil diperbarui. Silakan login.");
    setIsComplete(true);
    setIsSubmitting(false);

    setTimeout(() => {
      router.push("/login");
    }, 800);
  }

  const isFormDisabled = isSubmitting || isExchanging || !isReady || isComplete;

  return (
    <Card className="w-full max-w-md border-none bg-primary-foreground">
      <CardHeader className="flex flex-col items-center gap-4 mb-4">
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>Atur ulang password akun Anda</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isExchanging ? (
            <p className="text-sm text-muted-foreground text-center">
              Memvalidasi link reset...
            </p>
          ) : null}

          {!isExchanging && !isReady ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Link reset tidak valid atau sudah kedaluwarsa.
              </p>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Kirim ulang link reset
              </Link>
            </div>
          ) : null}

          {isReady ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password baru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isFormDisabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isFormDisabled}
                />
              </div>
            </>
          ) : null}
        </CardContent>

        {isReady ? (
          <CardFooter className="mt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isFormDisabled}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Password"}
            </Button>
          </CardFooter>
        ) : null}
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
