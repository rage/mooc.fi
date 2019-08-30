import { createMuiTheme } from "@material-ui/core/styles"
import amber from "@material-ui/core/colors/amber"

const rawTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#00A68D",
    },
    secondary: {
      main: amber[500],
    },
  },
  typography: {
    fontFamily: "roboto",
  },
  props: {
    MuiTextField: {
      variant: "outlined",
      fullWidth: true,
    },
    MuiFormControl: {
      variant: "outlined",
      fullWidth: true,
    },
    MuiButton: {
      variant: "contained",
      color: "primary",
    },
  },
  overrides: {
    MuiButton: {
      label: {
        textTransform: "none",

        fontFamily: "Open Sans Condensed",
      },
      root: {
        textTransform: "none",
      },
    },
  },
})

const theme = {
  ...rawTheme,
  typography: {
    ...rawTheme.typography,
    h1: {
      ...rawTheme.typography.h1,
      paddingBottom: "1rem",
      fontSize: 32,
      fontFamily: "Open Sans Condensed",
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
      fontFamily: "Open Sans Condensed",
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
      fontFamily: "Open Sans Condensed",
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: "Open Sans Condensed",
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
