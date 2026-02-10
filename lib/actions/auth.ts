"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpWithEmail(email: string, password: string) {
  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("provider")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Profile check failed:", error);
    return { error: "Terjadi kesalahan sistem." };
  }

  // Email sudah terdaftar dengan metode lain
  if (profile && profile.provider !== "email") {
    return {
      error: `Email ini sudah terdaftar menggunakan ${profile.provider === "google" ? "Google" : "metode lain"}. Silakan login dengan metode tersebut.`,
      shouldRedirectToLogin: true,
    };
  }

  // Email sudah terdaftar dengan metode email
  if (profile && profile.provider === "email") {
    return {
      error: "Email ini sudah terdaftar. Silakan login.",
      shouldRedirectToLogin: true,
    };
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=verify`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!data.user) {
    return { error: "Terjadi kesalahan saat membuat akun." };
  }

  // Buat atau perbarui profile dengan provider "email" (upsert supaya idempoten)
  const normalizedEmail = email.toLowerCase();
  const { error: profileCreateError } = await admin.from("profiles").upsert(
    {
      id: data.user.id,
      email: normalizedEmail,
      provider: "email",
      role: "user",
    },
    {
      onConflict: "id",
    },
  );

  if (profileCreateError) {
    // Log error, tapi jangan batalkan alur verifikasi — user sudah dibuat di Supabase
    console.error("Profile upsert failed:", profileCreateError);
  }

  return {
    needsVerification: !data.session,
  };
}

export async function signInWithEmail(email: string, password: string) {
  const admin = createAdminClient();
  const normalizedEmail = email.toLowerCase();

  // Cek apakah email sudah terdaftar
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("provider")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (profileError) {
    console.error("Profile check failed:", profileError);
    return { error: "Terjadi kesalahan sistem." };
  }

  // Email belum terdaftar
  if (!profile) {
    return {
      error: "Email belum terdaftar. Silakan daftar terlebih dahulu.",
    };
  }

  // Email terdaftar dengan metode lain
  if (profile.provider !== "email") {
    return {
      error: `Email ini terdaftar menggunakan ${profile.provider === "google" ? "Google" : "metode lain"}. Silakan login dengan metode tersebut.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Get user role untuk final redirect
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  redirect("/dashboard");
}

export async function requestPasswordReset(email: string) {
  const admin = createAdminClient();
  const normalizedEmail = email.toLowerCase();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("provider")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (profileError) {
    console.error("Profile check failed:", profileError);
    return { error: "Terjadi kesalahan sistem." };
  }

  if (!profile) {
    return { error: "Email tidak terdaftar. Silakan cek kembali." };
  }

  if (profile.provider !== "email") {
    return {
      error: "Email ini sudah terdaftar dengan metode lain. Silakan login.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    normalizedEmail,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    },
  );

  if (error) {
    return { error: error.message };
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getUserProfile error:", error);
    return null;
  }

  return profile;
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getUser();

  if (!user) redirect("/login");

  const profile = await getUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
