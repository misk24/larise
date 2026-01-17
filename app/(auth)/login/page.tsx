import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Masuk - Nikahku",
  description: "Masuk ke akun Nikahku Anda",
}

export default function LoginPage() {
  return <LoginForm />
}
