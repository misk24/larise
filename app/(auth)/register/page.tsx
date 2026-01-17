import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daftar - Nikahku",
  description: "Buat akun Nikahku baru",
}

export default function RegisterPage() {
  return <RegisterForm />
}
