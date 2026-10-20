"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  loginSchema,
  registerSchema,
  safeRedirectPath,
} from "@/lib/auth/validation";

const getSiteUrl = () => {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  return (value.startsWith("http") ? value : `https://${value}`).replace(/\/$/, "");
};

function providerLabel(provider: string | null | undefined) {
  if (provider === "google") return "Google";
  if (provider === "email") return "email dan password";
  return "metode login yang digunakan sebelumnya";
}

function isDuplicateAuthError(message: string) {
  return /already registered|already exists|user already|email.*taken/i.test(message);
}

export async function signUpWithEmail(email: string, password: string): Promise<{ error?: string; shouldRedirectToLogin?: boolean; needsVerification?: boolean }> {
  const validation = registerSchema.safeParse({
    email,
    password,
    confirmPassword: password,
  });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Data registrasi tidak valid." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admin = createAdminClient();

  const { data: existingProfile, error: profileLookupError } = await admin
    .from("profiles")
    .select("provider")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (profileLookupError) {
    console.error("Registration profile lookup failed:", profileLookupError);
    return { error: "Registrasi belum dapat diproses. Coba lagi nanti." };
  }

  if (existingProfile) {
    return {
      error: `Email ini sudah terdaftar menggunakan ${providerLabel(existingProfile.provider)}. Silakan login dengan metode tersebut.`,
      shouldRedirectToLogin: true,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?type=verify`,
    },
  });

  if (error) {
    if (isDuplicateAuthError(error.message)) {
      return {
        error: "Email ini sudah terdaftar. Silakan login atau gunakan fitur lupa password.",
        shouldRedirectToLogin: true,
      };
    }
    console.error("Email registration failed:", error.message);
    return { error: "Registrasi gagal. Periksa data dan coba lagi." };
  }

  if (!data.user) {
    return { error: "Registrasi belum berhasil. Silakan coba lagi." };
  }

  // Supabase can return a synthetic user for duplicate emails when email
  // confirmation is enabled. An empty identities list means this is not a new account.
  if (data.user.identities && data.user.identities.length === 0) {
    return {
      error: "Email ini sudah terdaftar. Silakan login atau gunakan fitur lupa password.",
      shouldRedirectToLogin: true,
    };
  }

  // Profiles may also be created by a database trigger. Upsert makes this
  // operation safe when that trigger has already created the row.
  const { error: upsertError } = await admin.from("profiles").upsert(
    {
      id: data.user.id,
      email: normalizedEmail,
      provider: "email",
      role: "user",
    },
    { onConflict: "id" },
  );

  if (upsertError) {
    console.error("Registration profile upsert failed:", upsertError);
    // Do not delete the Auth user here: a retry should not destroy an account
    // that may already have been created successfully by Supabase.
    return { error: "Akun dibuat, tetapi profil belum siap. Silakan coba login atau hubungi dukungan." };
  }

  return { needsVerification: !data.session };
}

export async function signInWithEmail(
  email: string,
  password: string,
  redirectTo?: string | null,
): Promise<{ error?: string; success?: boolean; redirectTo?: string }> {
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Data login tidak valid." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.user) {
    // Give users a useful provider hint only after password authentication fails.
    // The reset flow itself always uses a generic response to avoid enumeration.
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("provider")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (profile && profile.provider !== "email") {
      return {
        error: `Email ini terdaftar menggunakan ${providerLabel(profile.provider)}. Silakan login dengan metode tersebut.`,
      };
    }

    if (error && /email not confirmed/i.test(error.message)) {
      return { error: "Verifikasi email terlebih dahulu melalui tautan yang kami kirim." };
    }

    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Login profile lookup failed:", profileError);
    await supabase.auth.signOut();
    return { error: "Login belum dapat diselesaikan. Coba lagi nanti." };
  }

  const defaultDestination = profile?.role === "admin" ? "/admin" : "/dashboard";
  const requestedDestination = safeRedirectPath(redirectTo, defaultDestination);
  const destination =
    profile?.role === "admin"
      ? "/admin"
      : requestedDestination.startsWith("/admin")
        ? "/dashboard"
        : requestedDestination;

  return { success: true, redirectTo: destination };
}

export async function requestPasswordReset(email: string): Promise<{ error?: string; success?: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = await createClient();

  // Keep the response generic so callers cannot enumerate registered accounts.
  // Only email/password accounts receive a recovery email; Google-only accounts
  // must continue using Google sign-in.
  const admin = createAdminClient();
  const { data: profile, error: lookupError } = await admin
    .from("profiles")
    .select("provider")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    console.error("Password reset profile lookup failed:", lookupError);
    return { error: "Permintaan reset belum dapat diproses. Coba lagi nanti." };
  }

  if (profile?.provider === "email") {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${getSiteUrl()}/auth/recovery-callback`,
    });

    if (error) {
      console.error("Password reset request failed:", error.message);
      return { error: "Email reset belum dapat dikirim. Coba lagi nanti." };
    }
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Session user lookup failed:", error.message);
    return null;
  }
  return user;
}

export async function updateProfile(input: { full_name: string; phone: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi login tidak valid." };

  const fullName = input.full_name.trim().slice(0, 120);
  const phone = input.phone.trim().slice(0, 30);
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null, phone: input.phone.trim().slice(0, 30) || null })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update failed:", error);
    return { error: "Profil gagal diperbarui." };
  }
  return { success: true };
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("User profile lookup failed:", error);
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
