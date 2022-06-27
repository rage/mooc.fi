import { PropsWithChildren } from "react"

import styled from "@emotion/styled"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ReactGA from "react-ga"

interface OutboundLinkProps {
  eventLabel: string
  to: string
  label?: string
}

const ExternalLinkIcon = styled((props: any) => (
  <FontAwesomeIcon icon={faUpRightFromSquare} size="xs" {...props} />
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
