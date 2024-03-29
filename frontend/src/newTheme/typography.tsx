import { CSSProperties } from "react"

import { createTheme, responsiveFontSizes, Theme } from "@mui/material/styles"

import { themeFontSize } from "../theme/util"
import { bodyFont, headerFont } from "./fonts"

export const fontVariableClass = `${headerFont.variable} ${bodyFont.variable}`
export const bodyFontDeclaration = bodyFont.style

export const withTypography = (theme: Theme) => {
  const commonHeadingStyles: CSSProperties = {
    color: theme.palette.common.brand.nearlyBlack,
    margin: 0,
    width: "100%",
    fontWeight: 700,
    fontFamily: headerFont.style.fontFamily,
    padding: "1.5rem 0 1rem",
    display: "flex",
    flexGrow: "1",
    flexShrink: "0",
    maxWidth: "100%",

    [theme.breakpoints.up("xs")]: {
      padding: "2rem 0 1rem",
    },
  }
  const typography: Theme["typography"] = {
    ...theme.typography,
    fontFamily: bodyFont.style.fontFamily,
    button: {
      label: {
        fontFamily: bodyFont.style.fontFamily,
      },
    },
    h1: {
      ...themeFontSize(46, 54),
      ...commonHeadingStyles,
      letterSpacing: "-1.15px",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.8px",
      },
      [theme.breakpoints.up("xl")]: {
        letterSpacing: "-1.3px",
      },
    },
    h2: {
      ...themeFontSize(30, 36),
      ...commonHeadingStyles,
      letterSpacing: "-0.6px",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.52px",
      },
    },
    h3: {
      ...themeFontSize(26, 32),
      ...commonHeadingStyles,
      letterSpacing: "-0.8px",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.7px",
      },
    },
    h4: {
      ...themeFontSize(22, 28),
      ...commonHeadingStyles,
      letterSpacing: "-0.69px",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.56px",
      },
    },
    h5: {
      ...themeFontSize(18, 24),
      ...commonHeadingStyles,
      letterSpacing: "-0.56px",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.5px",
      },
    },
    h6: {
      ...themeFontSize(16, 20),
      ...commonHeadingStyles,
      letterSpacing: "-0.5px",
      [theme.breakpoints.down("xs")]: {
        letterSpacing: "-0.44px",
      },
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
