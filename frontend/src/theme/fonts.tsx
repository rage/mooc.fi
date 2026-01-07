import { Open_Sans, Roboto } from "next/font/google"

export const bodyFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["italic", "normal"],
  fallback: ["Franklin Gothic Medium", "Tahoma", "Arial", "sans-serif"],
  variable: "--body-font",
  display: "swap",
})

export const headerFont = Open_Sans({
  subsets: ["latin"],
  style: ["italic", "normal"],
  axes: ["wdth"],
  fallback: ["Impact", "Franklin Gothic Bold", "sans-serif"],
  variable: "--header-font",
  display: "swap",
})
