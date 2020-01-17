import React from "react"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import WarningIcon from "@material-ui/icons/Warning"
import styled from "styled-components"

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

interface SnackbarContentExtraProps {
  variant: keyof typeof variantIcon
}

const StyledSnackbarContent = styled(SnackbarContent)<
  SnackbarContentExtraProps
>`
    ${props => props.variant === "info" && `background-color: #3f51b5;`}
    ${props => props.variant === "success" && `background-color: #43a047;`}
    ${props => props.variant === "error" && `background-color: #d32f2f;`}
    ${props => props.variant === "warning" && `background-color: #ffa000;`}
    `

const Span = styled.span``
export interface Props {
  className?: string
  message?: string
  onClose?: () => void
  variant: keyof typeof variantIcon
}

function SnackbarContentWrapper(props: Props) {
  const { className, message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]
  const StyledIcon = styled(Icon)`
    opacity: 0.9;
    margin-right: 1rem;
  `
  return (
    <StyledSnackbarContent
      variant={props.variant}
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
