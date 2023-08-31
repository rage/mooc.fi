import { withComponents } from "./components"
import { withPalette } from "./palette"
import { withTypography } from "./typography"

import type {} from "@mui/x-date-pickers/themeAugmentation"
import type {} from "@mui/lab/themeAugmentation"

import { pipe } from "remeda"

import { createTheme } from "@mui/material/styles"

let theme = createTheme({
  breakpoints: {
    values: {
      xxxs: 0,
      xxs: 360,
      xs: 480,
      sm: 640,
      md: 960,
      desktop: 1024,
      lg: 1200,
      xl: 1600,
      xxl: 1920,
    },
  },
})

theme = pipe(theme, withPalette, withTypography, withComponents)

export { fontVariableClass } from "./typography"
export default theme
