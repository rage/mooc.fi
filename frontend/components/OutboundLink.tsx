import React, { PropsWithChildren } from "react"

import upRightFromSquareSvg from "@fortawesome/fontawesome-free/svgs/solid/up-right-from-square.svg"
import { EnhancedLink, Link, LinkProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledOutboundLink = styled(Link)`
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
` as EnhancedLink

function OutboundLink({
  label,
  children,
  ...props
}: PropsWithChildren<LinkProps>) {
  return (
    <StyledOutboundLink target="_blank" aria-label={label} {...props}>
      {children}
    </StyledOutboundLink>
  )
}

export default OutboundLink
