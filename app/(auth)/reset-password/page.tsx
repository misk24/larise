import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "LARISÉ - Reset Password",
  description: "Atur ulang password akun LARISÉ",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
