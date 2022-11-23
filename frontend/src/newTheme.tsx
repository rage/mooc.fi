import { amber } from "@mui/material/colors"
import { createTheme, css, Theme } from "@mui/material/styles"

const latoFamily = "Lato, system-ui, Cantarell, Ubuntu, roboto, sans-serif"
// @ts-ignore: not used
const ralewayFamily =
  "Raleway, system-ui, Cantarell, Ubuntu, roboto, sans-serif"
// @ts-ignore: not used
const epilogueFamily =
  "Epilogue, system-ui, Cantarell, Ubuntu, roboto, sans-serif"
const encodeSansFamily =
  "Encode Sans, system-ui, Cantarell, Ubuntu, roboto, sans-serif"

const headerFontFamily = ralewayFamily
const bodyFontFamily = latoFamily

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
    fontFamily: bodyFontFamily,
    button: {
      label: {
        textTransform: "uppercase",
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
          fontFamily: bodyFontFamily,
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
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
      fontWeight: 600,
      fontSize: 40,
      "@media (min-width: 600px)": {
        fontSize: 48,
      },
      "@media (min-width: 960px)": {
        fontSize: 60,
      },
    },
    h2: {
      ...rawTheme.typography.h2,
      paddingBottom: "1rem",
      fontSize: 36,
      fontFamily: headerFontFamily,
      fontWeight: 600,
      fontStretch: "condensed",
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
      "@media (min-width: 960px)": {
        fontSize: 24,
      },
      "@media (min-width: 1440px)": {
        fontSize: 28,
      },
    },
    h3: {
      ...rawTheme.typography.h3,
      paddingBottom: "0.5rem",
      paddingTop: "0.7rem",
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
      fontWeight: 600,
      fontSize: 16,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    h4: {
      ...rawTheme.typography.h4,
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
      fontSize: 14,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    h5: {
      ...rawTheme.typography.h5,
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
    },
    h6: {
      ...rawTheme.typography.h6,
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontFamily: headerFontFamily,
      fontStretch: "condensed",
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
      fontFamily: bodyFontFamily,
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
  @import url("https://fonts.googleapis.com/css2?family=Encode+Sans:wdth,wght@75,400;75,500;75,600;75,700&family=Epilogue:wght@400;500;700;900&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,800;0,900;1,300;1,400;1,500;1,600&display=swap");
`

export default theme
