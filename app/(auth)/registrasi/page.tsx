import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LARISÉ - Registrasi",
  description: "Buat akun LARISÉ baru",
};

export default function RegistrasiPage() {
  return <RegisterForm />;
}
