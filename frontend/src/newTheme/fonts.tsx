import { Open_Sans } from "next/font/google"

export const headerFont = Open_Sans({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  display: "swap",
  subsets: ["latin"],
  variable: "--header-font",
  preload: false,
})

export const bodyFont = Open_Sans({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  display: "swap",
  subsets: ["latin"],
  variable: "--body-font",
  preload: false,
})
