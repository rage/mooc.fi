import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import WarningIcon from "@material-ui/icons/Warning"
import styled from "styled-components"

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

interface SnackbarContentExtraProps {
  type: keyof typeof typeIcon
}

const StyledSnackbarContent = styled(
  SnackbarContent,
)<SnackbarContentExtraProps>`
  background-color: ${(props) => bgColor[props.type]};
`

const Span = styled.span``

export interface Props {
  className?: string
  message?: string
  onClose?: () => void
  type: keyof typeof typeIcon
}

function SnackbarContentWrapper(props: Props) {
  const { className, message, onClose, type, ...other } = props
  const Icon = typeIcon[type]
  const StyledIcon = styled(Icon)`
    opacity: 0.9;
    margin-right: 1rem;
  `
  return (
    <StyledSnackbarContent
      type={type}
      aria-describedby="client-snackbar"
      message={
        <Span id="client-snackbar">
          <StyledIcon />
          {message}
        </Span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
      {...other}
    />
  )
}

export default SnackbarContentWrapper
