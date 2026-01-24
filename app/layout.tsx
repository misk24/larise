import { Toaster } from "@/components/ui/sonner"
import type { Metadata, Viewport } from "next"
import type React from "react"
import { begum, rosehot, satoshi } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "LARISÉ",
  description:
    "Buat undangan pernikahan digital yang elegan dan personal. Fitur lengkap: RSVP, galeri foto, ucapan & hadiah, countdown, dan musik latar.",
  keywords: ["undangan pernikahan digital", "wedding invitation", "undangan online", "RSVP online"],
  authors: [{ name: "LARISÉ" }],
  openGraph: {
    title: "LARISÉ - Undangan Pernikahan Digital Premium",
    description: "Buat undangan pernikahan digital yang elegan dan personal.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#f7f4ef",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${begum.variable} ${rosehot.variable} ${satoshi.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
