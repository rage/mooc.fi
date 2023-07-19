import {
  ButtonBaseProps,
  ButtonProps,
  EnhancedLinkProps,
  FormControlProps,
  MenuItemProps,
  TextFieldProps,
} from "@mui/material"
import { createTheme, Theme } from "@mui/material/styles"

import { headerFontDeclaration } from "./typography"
import { LinkBehavior } from "/components/Link"

export const withComponents = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as EnhancedLinkProps,
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
          variant: "contained",
          color: "primary",
          LinkComponent: LinkBehavior,
        } as ButtonProps,
        styleOverrides: {
          root: {
            textTransform: "none",
            ...headerFontDeclaration,
            fontWeight: 100,
          },
        },
      },
    },
  })
