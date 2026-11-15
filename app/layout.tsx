import { MotionProvider } from "@/components/motion/motion-provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import type React from "react";
import { getSiteUrl } from "@/lib/site-url";
import { geistMono, geistSans, rosehot, satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "LARISÉ",
  description:
    "Buat undangan pernikahan digital yang elegan dan personal. Kelola RSVP, galeri foto, ucapan, hadiah, dan detail acara dalam satu tempat.",
  keywords: [
    "undangan pernikahan digital",
    "wedding invitation",
    "undangan online",
    "RSVP online",
  ],
  authors: [{ name: "LARISÉ" }],
  openGraph: {
    title: "LARISÉ - Undangan Pernikahan Digital Premium",
    description: "Buat undangan pernikahan digital yang elegan dan personal.",
    type: "website",
    locale: "id_ID",
    siteName: "LARISÉ",
    images: [{ url: "/images/hero.jpg", alt: "LARISÉ undangan pernikahan digital" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/hero.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#F8F6F1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${rosehot.variable} ${satoshi.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* data-theme (not the .dark class) keeps dark mode scoped to the landing. */}
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem enableColorScheme={false} storageKey="larise-theme" disableTransitionOnChange>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
