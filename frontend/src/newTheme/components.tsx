import { createTheme, Theme } from "@mui/material/styles"

import { bodyFontDeclaration } from "./typography"
import { LinkBehavior } from "/components/Link"

export const withComponents = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        },
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
            ...bodyFontDeclaration,
            textTransform: "uppercase",
            borderRadius: "20px",
          },
        },
      },
    },
  })
