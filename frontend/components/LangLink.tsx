import React, { useContext } from "react"
import Link, { LinkProps } from "next/link"
import LanguageContext from "/contexes/LanguageContext"
import path from "path"

interface LangLinkProps extends LinkProps {
  children: React.ReactNode
}

const LangLink = (props: LangLinkProps) => {
  const { as: _as, href, children } = props
  const lng = useContext(LanguageContext)
  const isFi = lng.language === "fi"

  const basename = path.basename((_as as string) || "")

  const [__as, _href] =
    isFi && (basename.includes("index") || basename === "fi")
      ? ["/", "/"]
      : [_as ? `/${lng.language}${_as}` : undefined, href]

  /*   const _as = lng.language === "fi" ? as : `/${lng.language}${as}`
  const _href =
    lng.language === "fi" ? (href as string).replace("[lng]/", "") : href */

  return (
    <Link {...props} as={__as} href={_href}>
      {children}
    </Link>
  )
}

export default LangLink
