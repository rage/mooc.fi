import { Snackbar } from "@material-ui/core"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton"
import WarningIcon from "@material-ui/icons/Warning"
import styled from "@emotion/styled"

interface CustomSnackbarProps {
  open: boolean
  setOpen: Function
  type: "error" | "success" | "warning" | "error"
  message: string
}

const typeIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const bgColor: Record<keyof typeof typeIcon, string> = {
  success: "#43a047",
  warning: "#ffa000",
  error: "#d32f2f",
  info: "#3f51b5",
}

const CustomSnackbar = (props: CustomSnackbarProps) => {
  const { open, setOpen, type, message } = props
  const Icon = typeIcon[type]
  const StyledIcon = styled(Icon)`
    opacity: 0.9;
    margin-right: 1rem;
  `
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    event?.preventDefault()
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={
        <span id="client-snackbar" aria-describedby="client-snackbar">
          <StyledIcon />
          {message}
        </span>
      }
      action={
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      }
      ContentProps={{
        style: { backgroundColor: bgColor[type] },
      }}
    />
  )
}
export default CustomSnackbar
