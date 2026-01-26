import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "LARISÉ - Login",
  description: "Masuk ke akun LARISÉ Anda",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
