import {
  ButtonBaseProps,
  ButtonProps,
  FormControlProps,
  LinkProps,
  MenuItemProps,
  TextFieldProps,
} from "@mui/material"
import { createTheme, Theme } from "@mui/material/styles"

import { bodyFontDeclaration } from "./typography"
import { LinkBehavior } from "/components/Link"

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
        } as TextFieldProps,
      },
      MuiFormControl: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        } as FormControlProps,
        styleOverrides: {
          root: {
            margin: "", // invalid style actually, but anything else would override the text field in forms
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        } as ButtonBaseProps,
      },
      MuiMenuItem: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        } as MenuItemProps,
      },
      MuiButton: {
        defaultProps: {
          variant: "outlined",
          color: "primary",
          LinkComponent: LinkBehavior,
        } as ButtonProps,
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
