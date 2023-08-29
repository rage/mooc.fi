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
          disableRipple: true,
        } as ButtonBaseProps,
        styleOverrides: {
          root: {
            ...bodyFontDeclaration,
          },
        },
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
          variant: "text",
          color: "primary",
          disableRipple: true,
          LinkComponent: LinkBehavior,
        } as ButtonProps,
        styleOverrides: {
          root: {
            ...bodyFontDeclaration,
          },
          /* borderRadius: 0,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9375rem",
            lineHeight: "0.9375rem",
            justifyContent: "center",
            margin: 0,
            padding: 0,
            transitionDuration: "0.1s",
            transitionProperty: "all",
            minHeight: "44px",
            position: "relative",
            textDecoration: "none",
            ".MuiButton-startIcon": {
              alignContent: "center",
              display: "flex",
              margin: "0",
              svg: {
                fontSize: "13px"
              }
            },
            ".MuiButton-endIcon": {
              alignContent: "center",
              display: "flex",
              margin: "0",
              paddingRight: "12px",
              svg: {
                fontSize: "13px"
              }
            },
          },*/
          contained: {
            ...bodyFontDeclaration,
            cursor: "pointer",
            fontWeight: "700",
            position: "relative",
            textDecoration: "none",
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            maxWidth: "328px",
            padding: "13px 16px",
            fontSize: "16px",
            lineHeight: "18px",
            letterSpacing: "-0.3px",
            svg: {
              marginLeft: "8px",
              height: "16px",
              width: "16px",
            },
          },
          containedSecondary: {
            backgroundColor: theme.palette.common.grayscale.white,
            border: `4px solid ${theme.palette.common.grayscale.black}`,
            color: theme.palette.common.grayscale.black,
            svg: {
              backgroundColor: theme.palette.common.grayscale.white,
              fill: theme.palette.common.grayscale.black,
            },
          },
          text: {
            borderRadius: 0,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9375rem",
            lineHeight: "0.9375rem",
            justifyContent: "center",
            margin: 0,
            padding: 0,
            transitionDuration: "0.1s",
            transitionProperty: "all",
            minHeight: "44px",
            position: "relative",
            textDecoration: "none",
            ".MuiButton-startIcon": {
              alignContent: "center",
              display: "flex",
              margin: "0",
              svg: {
                fontSize: "13px",
              },
            },
            ".MuiButton-endIcon": {
              alignContent: "center",
              display: "flex",
              margin: "0",
              paddingRight: "12px",
              svg: {
                fontSize: "13px",
              },
            },
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
          textPrimary: {
            backgroundColor: theme.palette.common.brand.main,
            color: theme.palette.common.grayscale.white,
            ".MuiButton-startIcon": {
              padding: "8px 13px",
              fill: theme.palette.common.grayscale.white,
            },
            ".MuiButton-endIcon": {
              padding: "8px 12px 8px 13px",
              fill: theme.palette.common.grayscale.white,
            },
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
          textSecondary: {
            backgroundColor: "transparent",
            border: `solid 2px ${theme.palette.common.brand.main}`,
            color: theme.palette.common.brand.main,
            boxShadow: "none",
            ".MuiButton-startIcon": {
              fill: theme.palette.common.brand.main,
            },
            ".MuiButton-endIcon": {
              fill: theme.palette.common.brand.main,
            },
            ".svg": {
              fill: theme.palette.common.brand.main,
            },
            "&:hover": {
              border: `solid 2px ${theme.palette.common.brand.active}`,
              color: theme.palette.common.brand.active,
              svg: {
                fill: theme.palette.common.brand.active,
              },
              textDecoration: "underline",
              backgroundColor: "inherit",
              boxShadow: "none",
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
          containedSizeLarge: {
            minHeight: "48px",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            height: "auto",
            minHeight: "131px",
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
        defaultProps: {
          disableGutters: true,
          variant: "dense",
        },
        styleOverrides: {
          root: {
            padding: "0 8px",
            display: "flex",
            justifyContent: "space-between",
            minHeight: "0",
            [theme.breakpoints.up("xs")]: {
              minHeight: "48px",
            },
            [theme.breakpoints.up("lg")]: {
              padding: "0 32px",
            },
          },
        },
      },
    },
  } as Partial<Theme>)
