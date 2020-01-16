import { Snackbar } from "@material-ui/core"
import SnackbarContentWrapper from "./SnackbarContentWrapper"

interface CustomSnackbarProps {
  open: boolean
  setOpen: Function
  variant: "error" | "success" | "warning" | "error"
  message: string
}

const CustomSnackbar = (props: CustomSnackbarProps) => {
  const { open, setOpen, variant, message } = props

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    event?.preventDefault()
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContentWrapper
          onClose={handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
    </div>
  )
}
export default CustomSnackbar
