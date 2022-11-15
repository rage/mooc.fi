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
  },
})

theme = flow(withTypography, withComponents)(theme)

export default theme
