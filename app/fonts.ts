import localFont from "next/font/local"

export const rosehot = localFont({
  src: [
    {
      path: "../public/fonts/rosehot/Rosehot.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-heading",
  display: "swap",
})

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
})
