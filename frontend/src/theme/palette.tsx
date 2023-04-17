import { amber } from "@mui/material/colors"
import { createTheme, Theme } from "@mui/material/styles"

export const withPalette = (theme: Theme) =>
  createTheme({
    ...theme,
    palette: {
      primary: {
        main: "#378170",
      },
      secondary: {
        main: amber[500],
      },
    },
  })
