import type { Metadata } from "next";
import Navbar from "@/components/landing/navbar";
import { begum, satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "L A R I S É",
  description: "Wedding Invitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${begum.variable} ${satoshi.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
