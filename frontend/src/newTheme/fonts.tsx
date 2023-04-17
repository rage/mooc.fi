import { Lato, Raleway } from "next/font/google"

export const headerFont = Raleway({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  fallback: ["system-ui", "Cantarell", "Ubuntu", "roboto", "sans-serif"],
  display: "swap",
  subsets: ["latin"],
  variable: "--header-font",
})

export const bodyFont = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  fallback: ["system-ui", "Cantarell", "Ubuntu", "roboto", "sans-serif"],
  display: "swap",
  subsets: ["latin"],
  variable: "--body-font",
})
