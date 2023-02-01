import React, { PropsWithChildren } from "react"

import ReactGA from "react-ga"

import upRightFromSquareSvg from "@fortawesome/fontawesome-free/svgs/solid/up-right-from-square.svg"
import { styled } from "@mui/material/styles"

interface OutboundLinkProps {
  label?: string
}

const StyledOutboundLink = styled(ReactGA.OutboundLink)`
  padding-right: 0.5rem;
  ::after {
    content: "";
    background-image: url(${upRightFromSquareSvg.src});
    background-size: 0.75rem 0.75rem;
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    margin-left: 0.5rem;
  }
` as React.FC<ReactGA.OutboundLinkProps & React.HTMLProps<HTMLAnchorElement>>

function OutboundLink({
  label,
  children,
  ...props
}: PropsWithChildren<
  ReactGA.OutboundLinkProps &
    React.HTMLProps<HTMLAnchorElement> &
    OutboundLinkProps
>) {
  return (
    <StyledOutboundLink target="_blank" aria-label={label} {...props}>
      {children}
    </StyledOutboundLink>
  )
}

export default OutboundLink
