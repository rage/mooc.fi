import { createMuiTheme } from "@material-ui/core/styles"
import purple from "@material-ui/core/colors/purple"
import amber from "@material-ui/core/colors/amber"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: amber[500],
    },
  },
  typography: {
    fontFamily: "Open Sans Condensed, sans-serif",
  },
})

export default theme
