import { createMuiTheme } from "@material-ui/core/styles"
import amber from "@material-ui/core/colors/amber"

const theme = createMuiTheme({
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
      },
      root: {
        textTransform: "none",
      },
    },
  },
})

export default theme
