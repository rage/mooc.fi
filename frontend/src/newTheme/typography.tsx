import { createTheme, responsiveFontSizes, Theme } from "@mui/material/styles"

import { bodyFont, headerFont } from "./fonts"

export const fontVariableClass = `${headerFont.variable} ${bodyFont.variable}`
export const bodyFontDeclaration = bodyFont.style

export const withTypography = (theme: Theme) => {
  const typography: Theme["typography"] = {
    ...theme.typography,
    fontFamily: bodyFont.style.fontFamily,
    button: {
      label: {
        fontFamily: bodyFont.style.fontFamily,
      },
    },
    h1: {
      paddingBottom: "1rem",
      fontSize: "4.5rem",
      fontFamily: headerFont.style.fontFamily,
      fontWeight: 700,
      letterSpacing: "-1.75px",
      lineHeight: 1.167,
      textTransform: "uppercase",
    },
    h2: {
      paddingBottom: "1rem",
      fontFamily: headerFont.style.fontFamily,
      fontSize: "3.25rem",
      fontWeight: 700,
      letterSpacing: "-1.5px",
      lineHeight: 1.154,
      textTransform: "uppercase",
    },
    h3: {
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: headerFont.style.fontFamily,
      fontSize: "2.875rem",
      fontWeight: 700,
      letterSpacing: "-1.15px",
      lineHeight: 1.174,
      textTransform: "uppercase",
    },
    h4: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.8px",
      textTransform: "uppercase",
    },
    h5: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1.25rem",
      fontWeight: 700,
      textTransform: "uppercase",
    },
    h6: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1rem",
      fontWeight: 700,
      lineHeight: 1.5,
      textTransform: "uppercase",
    },
    subtitle1: {
      fontFamily: headerFont.style.fontFamily,
      fontSize: "1rem",
    },
    subtitle2: {
      fontFamily: bodyFont.style.fontFamily,
      fontSize: "0.875rem",
      lineHeight: 1.1429,
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

  let newTheme = createTheme({ ...theme, typography })

  newTheme = responsiveFontSizes(newTheme)

  return newTheme
}
