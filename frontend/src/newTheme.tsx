import { amber } from "@mui/material/colors"
import { createTheme, Theme, css } from "@mui/material/styles"

const latoFamily = "Lato, system-ui, Cantarell, Ubuntu, roboto, sans-serif"
const ralewayFamily = "Raleway, system-ui, Cantarell, Ubuntu, roboto, sans-serif"

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
    fontFamily: latoFamily,
    button: {
      label: {
        textTransform: "uppercase" ,
        // fontFamily: "",
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
          textTransform: "uppercase",
          fontFamily: latoFamily,
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
      fontFamily: ralewayFamily,
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
      fontFamily: ralewayFamily,
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
      fontFamily: ralewayFamily,
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      fontFamily: ralewayFamily,
      fontSize: 14,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: ralewayFamily,
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

export const newFontCss = css`
  @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap');
`

export default theme
