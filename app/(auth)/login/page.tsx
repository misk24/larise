import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LARISÉ - Login",
  description: "Masuk ke akun LARISÉ Anda",
}

export default function LoginPage() {
  return <LoginForm />
}
