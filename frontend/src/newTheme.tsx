import { amber } from "@mui/material/colors"
import { createTheme, Theme } from "@mui/material/styles"

const rawTheme = createTheme({
  palette: {
    primary: {
      main: "#378170",
    },
    secondary: {
      main: amber[500],
    },
    /*  Coming in a later PR for the custom colors
      spgray: {
      main: "#1A2333",
    },
    spgreen: {
      main: "#065853",
    },
    sppurple: {
      main: "#51309F",
    },
    spblue: {
      main: "#08457A",
    }, */
  },
  typography: {
    fontFamily: "roboto",
    button: {
      label: {
        textTransform: "none",
        fontFamily: "Open Sans Condensed",
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
          fontFamily: "Roboto",
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
    h1: {
      ...rawTheme.typography.h1,
      paddingBottom: "1rem",
      fontFamily: "Roboto",
      fontSize: 48,
      "@media (min-width: 600px)": {
        fontSize: 56,
      },
      "@media (min-width: 960px)": {
        fontSize: 72,
      },
    },
    h2: {
      ...rawTheme.typography.h2,
      paddingBottom: "1rem",
      fontSize: 40,
      fontFamily: "Roboto",
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
    h3: {
      ...rawTheme.typography.h3,
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: "Roboto",
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      fontFamily: "Roboto",
      fontSize: 14,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: "Roboto",
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
