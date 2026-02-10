import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LARISÉ - Lupa Password",
  description: "Reset password akun LARISÉ",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
