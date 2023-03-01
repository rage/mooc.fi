import { ButtonBaseProps, MenuItemProps } from "@mui/material"
import { createTheme, Theme } from "@mui/material/styles"

import { LinkBehavior } from "/components/Link"
import { openSansCondensedDeclaration } from "/src/fonts"

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
      } as ButtonBaseProps,
      MuiMenuItem: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      } as MenuItemProps,
      MuiButton: {
        defaultProps: {
          variant: "contained",
          color: "primary",
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            ...openSansCondensedDeclaration,
          },
        },
      },
    },
  })
