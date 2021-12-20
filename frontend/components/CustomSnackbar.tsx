import styled from "@emotion/styled"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import WarningIcon from "@mui/icons-material/Warning"
import { Snackbar, SnackbarCloseReason } from "@mui/material"
import IconButton from "@mui/material/IconButton"

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
  // actual event type: React.SyntheticEvent<Element, Event>
  const handleClose = (event: any, reason?: SnackbarCloseReason) => {
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
          size="large"
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
