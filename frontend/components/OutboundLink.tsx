import React, { PropsWithChildren } from "react"

import { EnhancedLink, EnhancedLinkProps, Link as MUILink } from "@mui/material"
import { css, styled } from "@mui/material/styles"

const Link = MUILink as EnhancedLink

// inlined svg from @fortawesome/fontawesome-free/svgs/solid/up-right-from-square.svg
export const OutboundLinkTextStyle = css`
  ::before {
    content: "";
    white-space: nowrap;
    display: inline-block;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjMuMCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTM1MiAwYy0xMi45IDAtMjQuNiA3LjgtMjkuNiAxOS44cy0yLjIgMjUuNyA2LjkgMzQuOUwzNzAuNyA5NiAyMDEuNCAyNjUuNGMtMTIuNSAxMi41LTEyLjUgMzIuOCAwIDQ1LjNzMzIuOCAxMi41IDQ1LjMgMEw0MTYgMTQxLjNsNDEuNCA0MS40YzkuMiA5LjIgMjIuOSAxMS45IDM0LjkgNi45czE5LjgtMTYuNiAxOS44LTI5LjZWMzJjMC0xNy43LTE0LjMtMzItMzItMzJIMzUyek04MCAzMkMzNS44IDMyIDAgNjcuOCAwIDExMlY0MzJjMCA0NC4yIDM1LjggODAgODAgODBINDAwYzQ0LjIgMCA4MC0zNS44IDgwLTgwVjMyMGMwLTE3LjctMTQuMy0zMi0zMi0zMnMtMzIgMTQuMy0zMiAzMlY0MzJjMCA4LjgtNy4yIDE2LTE2IDE2SDgwYy04LjggMC0xNi03LjItMTYtMTZWMTEyYzAtOC44IDcuMi0xNiAxNi0xNkgxOTJjMTcuNyAwIDMyLTE0LjMgMzItMzJzLTE0LjMtMzItMzItMzJIODB6Ii8+PC9zdmc+");
    background-repeat: no-repeat;
    background-size: 0.75rem 0.75rem;
    background-position: left bottom;
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
    line-height: normal;
  }
`

const StyledOutboundLink = styled(Link)`
  ${OutboundLinkTextStyle.styles};
` as EnhancedLink

interface OutboundLinkProps extends PropsWithChildren<EnhancedLinkProps> {
  label?: string
  skipLinkStyling?: boolean
}

function OutboundLink({
  label,
  skipLinkStyling,
  children,
  ...props
}: OutboundLinkProps) {
  if (skipLinkStyling) {
    return (
      <Link target="_blank" aria-label={label} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <StyledOutboundLink target="_blank" aria-label={label} {...props}>
      {children}
    </StyledOutboundLink>
  )
}

export default OutboundLink
