import Link, { LinkProps as NextLinkProps } from "next/link"

import type {} from "@mui/x-date-pickers/themeAugmentation"

import React from "react"

import { LinkProps } from "@mui/material"
import { createTheme, responsiveFontSizes } from "@mui/material/styles"
import { amber } from "@mui/material/colors"

import { openSansCondensed, roboto } from "./fonts"

const LinkBehavior = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  (props, ref) => {
    const { href, ...other } = props
    return <Link ref={ref} href={href} {...other} />
  },
)

const openSansCondensedDeclaration = {
  ...openSansCondensed.style,
  //fontStretch: "condensed",
  //fontWeight: "300"
}

let theme = createTheme({
  palette: {
    primary: {
      main: "#378170",
    },
    secondary: {
      main: amber[500],
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    button: {
      label: {
        textTransform: "none",
        ...openSansCondensedDeclaration,
      },
    },
    // FIXME: disrepancy as h2 is larger than h1?
    h1: {
      paddingBottom: "1rem",
      fontSize: 40,
      fontFamily: roboto.style.fontFamily,
      /*"@media (min-width: 600px)": {
        fontSize: 30,
      },
      "@media (min-width: 960px)": {
        fontSize: 36,
      },
      "@media (min-width: 1440px)": {
        fontSize: 44,
      },*/
    },
    h2: {
      paddingBottom: "1rem",
      fontFamily: roboto.style.fontFamily,
      fontSize: 32,
      /*"@media (min-width: 600px)": {
        fontSize: 56,
      },
      "@media (min-width: 960px)": {
        fontSize: 72,
      },*/
    },
    h3: {
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: roboto.style.fontFamily,
      fontSize: 16,
      /*"@media (min-width: 600px)": {
        fontSize: 20,
      },*/
    },
    h4: {
      fontFamily: roboto.style.fontFamily,
      fontSize: 14,
      /*"@media (min-width: 600px)": {
        fontSize: 16,
      },*/
    },
    subtitle1: {
      fontFamily: roboto.style.fontFamily,
      fontSize: 18,
      /*"@media (min-width: 600px)": {
        fontSize: 22,
      },
      "@media (min-width: 1440px)": {
        fontSize: 32,
      },*/
    },
    body1: {
      fontSize: 12,
      /*"@media (min-width: 600px)": {
        fontSize: 14,
      },
      "@media (min-width: 960px)": {
        fontSize: 16,
      },*/
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          margin: "", // invalid style actually, but anything else would override the text field in forms
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: roboto.style.fontFamily,
          borderRadius: "20px",
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme)

export default theme
