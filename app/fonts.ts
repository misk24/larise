import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const rosehot = localFont({
  src: [
    {
      path: "../public/fonts/Rosehot.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-rosehot",
  display: "swap",
});

export const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
