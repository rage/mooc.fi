import { withTypography } from "./typography"

import type {} from "@mui/x-date-pickers/themeAugmentation"

import { flow } from "lodash"

import { amber } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

import { withComponents } from "./components"

let theme = createTheme({
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
  breakpoints: {
    values: {
      xxs: 0,
      xs: 400,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

theme = flow(withTypography, withComponents)(theme)

export default theme
