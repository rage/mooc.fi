import { createTheme, responsiveFontSizes, Theme } from "@mui/material/styles"
import { Lato, Raleway } from "@next/font/google"

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

export const fontVariableClass = `${headerFont.variable} ${bodyFont.variable}`

export const withTypography = (theme: Theme) => {
  const typography: Theme["typography"] = {
    ...theme.typography,
    fontFamily: bodyFont.style.fontFamily,
    button: {
      label: {
        textTransform: "uppercase",
        fontFamily: bodyFont.style.fontFamily,
      },
    },
    h1: {
      paddingBottom: "1rem",
      fontSize: "4.5rem",
      fontFamily: headerFont.style.fontFamily,
      fontStretch: "condensed",
      fontWeight: 600,
    },
    h2: {
      paddingBottom: "1rem",
      fontFamily: headerFont.style.fontFamily,
      fontSize: "3rem",
      fontWeight: 600,
      fontStretch: "condensed",
    },
    h3: {
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: headerFont.style.fontFamily,
      fontSize: "2.25rem",
      fontStretch: "condensed",
      fontWeight: 600,
    },
    h4: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1.75rem",
      fontWeight: 600,
      fontStretch: "condensed",
    },
    h5: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1.25rem",
      fontWeight: 600,
      fontStretch: "condensed",
    },
    h6: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1rem",
      fontStretch: "condensed",
    },
    subtitle1: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1rem",
      fontStretch: "condensed",
    },
    subtitle2: {
      fontFamily: bodyFont.style.fontFamily,
      fontSize: "0.875rem",
    },
    body1: {
      fontSize: "1rem",
      fontFamily: bodyFont.style.fontFamily,
    },
    body2: {
      fontSize: "0.875rem",
      fontFamily: bodyFont.style.fontFamily,
    },
    ingress: {
      fontSize: "1.25rem",
      fontFamily: bodyFont.style.fontFamily,
    },
  }

  let newTheme = createTheme(theme, { typography })

  newTheme = responsiveFontSizes(newTheme)

  return newTheme
}
