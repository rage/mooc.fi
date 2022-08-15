import { PropsWithChildren } from "react"

import ReactGA from "react-ga"

import styled from "@emotion/styled"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"

interface OutboundLinkProps {
  eventLabel: string
  to: string
  label?: string
}

const ExternalLinkIcon = styled((props: Partial<FontAwesomeIconProps>) => (
  <FontAwesomeIcon {...props} icon={faUpRightFromSquare} size="xs" />
))`
  padding-left: 0.25rem;
`
function OutboundLink({
  eventLabel,
  to,
  label,
  children,
  ...props
}: PropsWithChildren<OutboundLinkProps>) {
  return (
    <ReactGA.OutboundLink
      eventLabel={eventLabel}
      to={to}
      target="_blank"
      aria-label={label}
      {...props}
    >
      {children}
      <ExternalLinkIcon />
    </ReactGA.OutboundLink>
  )
}

export default OutboundLink
