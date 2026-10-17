"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, safeRedirectPath } from "@/lib/auth/validation";
import { redirect } from "next/navigation";

const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

function providerLabel(provider: string) {
  return provider === "google" ? "Google" : "email dan password";
}

export async function signUpWithEmail(email: string, password: string) {
  const validation = registerSchema.safeParse({ email, password, confirmPassword: password });
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Data registrasi tidak valid." };

  const normalizedEmail = email.trim().toLowerCase();
  const admin = createAdminClient();
  const { data: existing, error: lookupError } = await admin
    .from("profiles").select("id, provider").ilike("email", normalizedEmail).maybeSingle();

  if (lookupError) {
    console.error("Auth profile lookup failed:", lookupError);
    return { error: "Terjadi kesalahan sistem. Coba lagi nanti." };
  }
  if (existing) {
    return {
      error: `Email ini sudah terdaftar menggunakan ${providerLabel(existing.provider)}. Silakan login dengan metode tersebut.`,
      shouldRedirectToLogin: true,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback?type=verify` },
  });

  if (error) {
    if (/already registered|already exists|user already/i.test(error.message)) {
      return { error: "Email ini sudah terdaftar. Silakan login.", shouldRedirectToLogin: true };
    }
    console.error("Email sign-up failed:", error);
    return { error: "Registrasi gagal. Periksa data dan coba lagi." };
  }
  if (!data.user) return { error: "Registrasi gagal. Silakan coba lagi." };

  // Supabase may create profiles through a database trigger. Upsert is idempotent
  // for this auth user, while the database's case-insensitive email index prevents duplicates.
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email: normalizedEmail,
    provider: "email",
    role: "user",
  }, { onConflict: "id" });

  if (profileError) {
    console.error("Profile creation failed:", profileError);
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "Akun belum dapat dibuat dengan aman. Silakan coba lagi." };
  }

  return { needsVerification: !data.session };
}

export async function signInWithEmail(email: string, password: string, redirectTo?: string) {
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Data login tidak valid." };

  const normalizedEmail = email.trim().toLowerCase();
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles").select("id, provider, role").ilike("email", normalizedEmail).maybeSingle();

  if (profileError) {
    console.error("Auth profile lookup failed:", profileError);
    return { error: "Terjadi kesalahan sistem. Coba lagi nanti." };
  }
  if (!profile) return { error: "Email atau password salah, atau akun belum terdaftar." };
  if (profile.provider !== "email") {
    return { error: `Email ini terdaftar menggunakan ${providerLabel(profile.provider)}. Silakan login dengan metode tersebut.` };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
  if (error) {
    return { error: /email not confirmed/i.test(error.message)
      ? "Verifikasi email terlebih dahulu melalui tautan yang kami kirim."
      : "Email atau password salah. Silakan coba lagi." };
  }

  if (profile.role === "admin") redirect("/admin");
  const destination = safeRedirectPath(redirectTo);
  redirect(destination.startsWith("/admin") ? "/dashboard" : destination);
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles").select("provider").ilike("email", normalizedEmail).maybeSingle();

  if (error) {
    console.error("Password reset lookup failed:", error);
    return { error: "Permintaan reset belum dapat diproses. Coba lagi nanti." };
  }

  // Avoid exposing whether an email is registered or which provider it uses.
  if (profile?.provider === "email") {
    const supabase = await createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${siteUrl()}/auth/callback?type=recovery`,
    });
    if (resetError) {
      console.error("Password reset request failed:", resetError);
      return { error: "Email reset belum dapat dikirim. Coba lagi nanti." };
    }
  }
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function updateProfile(input: { full_name: string; phone: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const fullName = input.full_name.trim().slice(0, 120);
  const phone = input.phone.trim().slice(0, 30);
  const { error } = await supabase.from("profiles")
    .update({ full_name: fullName || null, phone: phone || null }).eq("id", user.id);
  if (error) return { error: "Profil gagal diperbarui." };
  return { success: true };
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) {
    console.error("getUserProfile failed:", error);
    return null;
  }
  return data;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");
  return profile;
}
