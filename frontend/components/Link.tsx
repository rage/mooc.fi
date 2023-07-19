import React from "react"

import NextLink, { LinkProps as NextLinkProps } from "next/link"

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & NextLinkProps
>((props, ref) => {
  const { href, ...other } = props
  return <NextLink ref={ref} href={href} {...other} />
})
