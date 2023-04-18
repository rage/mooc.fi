import { withComponents } from "./components"
import { withPalette } from "./palette"
import { withTypography } from "./typography"

import type {} from "@mui/x-date-pickers/themeAugmentation"
import type {} from "@mui/lab/themeAugmentation"

import { flow } from "lodash"

import { createTheme } from "@mui/material/styles"

let theme = createTheme({})

theme = flow(withPalette, withTypography, withComponents)(theme)

export { fontVariableClass } from "./typography"
export default theme
