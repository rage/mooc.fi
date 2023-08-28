import {
  ButtonBaseProps,
  ButtonProps,
  EnhancedLinkProps,
  FormControlProps,
  ListItemButtonProps,
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
          disableRipple: true,
        } as MenuItemProps,
      },
      MuiListItemButton: {
        defaultProps: {
          LinkComponent: LinkBehavior,
          disableRipple: true,
        } as ListItemButtonProps,
      },
      MuiButton: {
        defaultProps: {
          variant: "outlined",
          color: "primary",
          disableRipple: true,
          LinkComponent: LinkBehavior,
        } as ButtonProps,
        styleOverrides: {
          root: {
            ...bodyFontDeclaration,
            display: "flex",
            alignItems: "center",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9375rem",
            justifyContent: "center",
            lineHeight: "0.9375rem",
            margin: 0,
            padding: 0,
            transitionDuration: "0.1s",
            transitionProperty: "all",
            minHeight: "44px",
            position: "relative",
            textDecoration: "none",
          },
          contained: {
            backgroundColor: theme.palette.common.brand.main,
            color: theme.palette.common.grayscale.white,
            "&::after": {
              content: '""',
              display: "block",
              borderBottom: `2px solid ${theme.palette.common.additional.skyblue}`,
              position: "absolute",
              bottom: "-3.5px",
              left: "3px",
              right: "3px",
              zIndex: 0,
            },
            "&:disabled": {
              cursor: "not-allowed",
              "&::after": {
                borderBottom: `2px solid ${theme.palette.common.grayscale.mediumDark}`,
                bottom: "-3.5px",
              },
            },
          },
          containedPrimary: {
            backgroundColor: theme.palette.common.brand.main,
            color: theme.palette.common.grayscale.white,
            svg: {
              fill: theme.palette.common.grayscale.white,
            },
            "&:hover": {
              backgroundColor: theme.palette.common.brand.active,
            },
            "&:active": {
              backgroundColor: theme.palette.common.brand.dark,
            },
            "&:disabled": {
              backgroundColor: theme.palette.common.grayscale.medium,
              color: theme.palette.common.grayscale.dark,
              svg: {
                fill: theme.palette.common.grayscale.dark,
              },
              "&::after": {
                bottom: "-2px",
              },
            },
            "&:focus": {
              outline: `solid 2px ${theme.palette.common.additional.yellow.main}`,
              outlineOffset: "2px",
            },
            "&::after": {
              bottom: "-2px",
            },
          },
          containedSecondary: {
            backgroundColor: "transparent",
            border: `solid 2px ${theme.palette.common.brand.main}`,
            color: theme.palette.common.brand.main,
            ".svg": {
              fill: theme.palette.common.brand.main,
            },
            "&:hover": {
              border: `solid 2px ${theme.palette.common.brand.active}`,
              color: theme.palette.common.brand.active,
              svg: {
                fill: theme.palette.common.brand.active,
              },
            },
            "&:active": {
              border: `solid 2px ${theme.palette.common.brand.dark}`,
              color: theme.palette.common.brand.dark,
              svg: {
                fill: theme.palette.common.brand.dark,
              },
            },
            "&:disabled": {
              border: `solid 2px ${theme.palette.common.grayscale.mediumDark}`,
              color: theme.palette.common.grayscale.mediumDark,
              svg: {
                fill: theme.palette.common.grayscale.mediumDark,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.common.grayscale.white,
            zIndex: 100,
            borderBottom: `2px solid ${theme.palette.common.grayscale.dark}`,
            transform: "none",
            [theme.breakpoints.up("lg")]: {
              borderBottom: `1px solid ${theme.palette.common.grayscale.black}`,
              margin: "0 auto",
              maxWidth: "1920px",
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            padding: "0 8px",
            display: "flex",
            justifyContent: "space-between",
            [theme.breakpoints.up("lg")]: {
              padding: "0 32px",
            },
          },
        },
      },
    },
  } as Partial<Theme>)
