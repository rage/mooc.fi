import { amber } from "@mui/material/colors"
import { createTheme, Theme } from "@mui/material/styles"

import { openSansCondensed, roboto } from "./fonts"

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
      },
    },
  },
  components: {
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

const theme: Theme = {
  ...rawTheme,
  typography: {
    ...rawTheme.typography,
    // FIXME: disrepancy as h2 is larger than h1?
    h1: {
      ...rawTheme.typography.h1,
      paddingBottom: "1rem",
      fontSize: 40,
      fontFamily: roboto.style.fontFamily,
      "@media (min-width: 600px)": {
        fontSize: 30,
      },
      "@media (min-width: 960px)": {
        fontSize: 36,
      },
      "@media (min-width: 1440px)": {
        fontSize: 44,
      },
    },
    h2: {
      ...rawTheme.typography.h2,
      paddingBottom: "1rem",
      fontFamily: roboto.style.fontFamily,
      fontSize: 32,
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
      fontFamily: roboto.style.fontFamily,
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      fontFamily: roboto.style.fontFamily,
      fontSize: 14,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: roboto.style.fontFamily,
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
