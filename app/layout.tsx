import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import type React from "react";
import { geistMono, geistSans, rosehot, satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export const viewport: Viewport = {
  themeColor: "#FEFDFA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${rosehot.variable} ${satoshi.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
