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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter."),
    confirmPassword: z.string().min(6, "Password minimal 6 karakter."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
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

    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Data tidak valid.");
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
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    disabled={isFormDisabled}
                  >
                    {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">
                      {isConfirmPasswordVisible
                        ? "Hide password"
                        : "Show password"}
                    </span>
                  </Button>
                </div>
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
