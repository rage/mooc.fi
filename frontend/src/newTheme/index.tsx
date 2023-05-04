import { withComponents } from "./components"
import { withPalette } from "./palette"
import { withTypography } from "./typography"

import type {} from "@mui/x-date-pickers/themeAugmentation"
import type {} from "@mui/lab/themeAugmentation"

import { flow } from "lodash"

import { createTheme } from "@mui/material/styles"

let theme = createTheme({
  breakpoints: {
    values: {
      xxxs: 0,
      xxs: 360,
      xs: 480,
      sm: 640,
      md: 890,
      lg: 1200,
      xl: 1536,
    },
  },
})

theme = flow(withPalette, withTypography, withComponents)(theme)

export { fontVariableClass } from "./typography"
export default theme
