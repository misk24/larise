import localFont from "next/font/local"

export const begum = localFont({
  src: [
    {
      path: "../public/fonts/begum/Begum-Regular.otf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-heading",
  display: "swap",
});

export const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-body",
  display: "swap",
});