import React from "react"

import Link, { LinkProps as NextLinkProps } from "next/link"

import { LinkProps } from "@mui/material"
import { createTheme, Theme } from "@mui/material/styles"

import { bodyFont } from "./typography"

const LinkBehavior = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  (props, ref) => {
    const { href, ...other } = props
    return <Link ref={ref} href={href} {...other} />
  },
)

export const withComponents = (theme: Theme) =>
  createTheme(theme, {
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
            textTransform: "uppercase",
            fontFamily: bodyFont.style.fontFamily,
            borderRadius: "20px",
          },
        },
      },
    },
  })
