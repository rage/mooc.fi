import type {} from "@mui/x-date-pickers/themeAugmentation"

import React from "react"

import Link, { LinkProps as NextLinkProps } from "next/link"

import { LinkProps } from "@mui/material"
import { amber } from "@mui/material/colors"
import { createTheme, Theme } from "@mui/material/styles"

import { openSansCondensed, roboto } from "./fonts"

const LinkBehavior = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  (props, ref) => {
    const { href, ...other } = props
    return <Link ref={ref} href={href} {...other} />
  },
)

const rawTheme = createTheme({
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
        fontFamily: openSansCondensed.style.fontFamily,
        // fontWidth: "75%"
      },
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
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: openSansCondensed.style.fontFamily,
        },
      },
    },
  },
})

const theme: Theme = {
  ...rawTheme,
  typography: {
    ...rawTheme.typography,
    h1: {
      ...rawTheme.typography.h1,
      paddingBottom: "1rem",
      fontSize: 32,
      fontFamily: openSansCondensed.style.fontFamily,
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
      ...rawTheme.typography.h2,
      paddingBottom: "1rem",
      fontFamily: openSansCondensed.style.fontFamily,
      fontSize: 46,
      "@media (min-width: 600px)": {
        fontSize: 56,
      },
      "@media (min-width: 960px)": {
        fontSize: 72,
      },
    },
    h3: {
      ...rawTheme.typography.h3,
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: openSansCondensed.style.fontFamily,
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      fontFamily: openSansCondensed.style.fontFamily,
      fontSize: 14,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: openSansCondensed.style.fontFamily,
      fontSize: 18,
      "@media (min-width: 600px)": {
        fontSize: 22,
      },
      "@media (min-width: 1440px)": {
        fontSize: 32,
      },
    },
    body1: {
      ...rawTheme.typography.body1,
      fontSize: 12,
      "@media (min-width: 600px)": {
        fontSize: 14,
      },
      "@media (min-width: 960px)": {
        fontSize: 16,
      },
    },
  },
}

export default theme
