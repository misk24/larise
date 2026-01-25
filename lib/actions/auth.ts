"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUpWithEmail(email: string, password: string) {
  const admin = createAdminClient()
  const { data: profile, error } = await admin.from("profiles").select("provider").eq("email", email).maybeSingle()

  if (error) {
    console.error("Profile check failed:", error)
    return { error: "Terjadi kesalahan sistem." }
  }

  if (profile) {
    if (profile.provider !== "email") {
      return {
        error: `Email ini sudah terdaftar menggunakan metode lain. Silakan login dengan metode tersebut.`,
      }
    }

    return {
      error: "Email ini sudah terdaftar. Silakan login.",
    }
  }

  const supabase = await createClient()
  const { data, error: profileError } = await supabase.auth.signUp({
    email, 
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`,
    },
  })

  if (profileError) {
    return { error: profileError.message }
  }

  return {
    needsVerification: !data.session,
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({email, password})

  if (error) {
    return { error: error.message }
  }

  redirect("/auth/redirect")
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  redirect("/")
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("getUserProfile error:", error)
    return null
  }

  return profile
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await getUser()

  if (!user) redirect("/login")

  const profile = await getUserProfile()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return profile
}
