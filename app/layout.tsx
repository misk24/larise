import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
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
        <Header />
        {children}
      </body>
    </html>
  );
}
