import { createTheme, Theme } from "@mui/material/styles"

import { bodyFont, headerFont } from "./fonts"

export const headerFontDeclaration = {
  ...headerFont.style,
  fontFamily: headerFont.style.fontFamily,
  fontStretch: "condensed",
  fontWeight: "300",
}

export const fontVariableClass = `${headerFont.variable} ${bodyFont.variable}`

export const withTypography = (theme: Theme) =>
  createTheme({
    ...theme,
    typography: {
      fontFamily: bodyFont.style.fontFamily,
      button: {
        label: {
          textTransform: "none",
          ...headerFontDeclaration,
        },
      },
      h1: {
        paddingBottom: "1rem",
        fontSize: 32,
        ...headerFontDeclaration,
        "@media (min-width: 600px)": {
          fontSize: 42,
        },
        "@media (min-width: 960px)": {
          fontSize: 58,
        },
        "@media (min-width: 1440px)": {
          fontSize: 68,
        },
        letterSpacing: "-1px",
      },
      h2: {
        paddingBottom: "1rem",
        ...headerFontDeclaration,
        fontSize: 46,
        "@media (min-width: 600px)": {
          fontSize: 56,
        },
        "@media (min-width: 960px)": {
          fontSize: 72,
        },
      },
      h3: {
        paddingBottom: "0.5rem",
        paddingTop: "0.7rem",
        ...headerFontDeclaration,
        fontSize: 16,
        "@media (min-width: 600px)": {
          fontSize: 20,
        },
      },
      h4: {
        ...headerFontDeclaration,
        fontSize: 14,
        "@media (min-width: 600px)": {
          fontSize: 16,
        },
      },
      h6: {
        ...headerFontDeclaration,
        fontSize: 10,
        "@media (min-width: 600px)": {
          fontSize: 12,
        },
      },
      subtitle1: {
        ...headerFontDeclaration,
        fontSize: 18,
        "@media (min-width: 600px)": {
          fontSize: 22,
        },
        "@media (min-width: 1440px)": {
          fontSize: 32,
        },
      },
      body1: {
        fontSize: 12,
        "@media (min-width: 600px)": {
          fontSize: 14,
        },
        "@media (min-width: 960px)": {
          fontSize: 16,
        },
      },
    },
  })
