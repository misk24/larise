import { redirect } from "next/navigation";
import { ThemeSectionHorizontal } from "@/components/landing/collection/collections";
import { CTASection } from "@/components/landing/cta/cta";
import { FAQSection } from "@/components/landing/faq/faq";
import { FeaturesSection } from "@/components/landing/features/features";
import { Footer } from "@/components/landing/footer/footer";
import { HeroSection } from "@/components/landing/hero/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works/how-it-works";
import { Navbar } from "@/components/landing/navbar/navbar";
import { ValueSection } from "@/components/landing/value/value";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const code = params.code;

  // Supabase may fall back to its configured Site URL when a callback URL is
  // not allowlisted. If an OAuth code lands on the homepage, send it through
  // the server callback handler instead of rendering the landing page with it.
  if (typeof code === "string" && code.length > 0) {
    const callbackParams = new URLSearchParams({ code });
    for (const key of ["intent", "type"] as const) {
      const value = params[key];
      if (typeof value === "string" && value.length > 0) {
        callbackParams.set(key, value);
      }
    }
    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  return (
    <main className="frontend-shell min-h-screen">
      <Navbar />
      <HeroSection />
      <ValueSection />
      <ThemeSectionHorizontal />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
