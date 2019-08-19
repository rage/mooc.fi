import React, { useContext } from "react"
import Link, { LinkProps } from "next/link"
import LanguageContext from "/contexes/LanguageContext"
import { parse, format } from "url"

interface LangLinkProps extends LinkProps {
  children: React.ReactNode
}

const LangLink = (props: LangLinkProps) => {
  const { as: _as, href: _href, children } = props
  const lng = useContext(LanguageContext)
  const isFi = lng.language === "fi"

  const parsedHref: any =
    typeof _href === "object" ? _href : parse(_href || "", true)
  const parsedAs = (_as || format(parsedHref, { unicode: true })) as string

  const isOutsideLink = parsedAs.startsWith("http")

  let as = isOutsideLink
    ? parsedAs
    : ["en", "fi", "se", "[lng]"].reduce(
        (acc, curr) => acc.replace(`\/${curr}\/`, "/"),
        parsedAs,
      )

  const { path, hash } = parsedHref
  let { href } = parsedHref

  if (path === "/" && isFi) {
    as = "/"
  } else if (!path && hash) {
    as = hash
  } else if (!isOutsideLink) {
    as = `/${lng.language}${as}`.replace(/\/$/, "")
    href = `/[lng]${href.replace("/[lng]", "")}`.replace(/\/+/g, "/")
  }

  return (
    <Link {...props} as={as} href={href}>
      {children}
    </Link>
  )
}

export default LangLink
