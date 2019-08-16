import React, { useContext } from "react"
import Link, { LinkProps } from "next/link"
import LanguageContext from "/contexes/LanguageContext"

interface LangLinkProps extends LinkProps {
  children: React.ReactNode
}

const LangLink = (props: LangLinkProps) => {
  const { as, href, children } = props
  const lng = useContext(LanguageContext)

  const _as = lng.language === "fi" ? as : `/${lng.language}${as}`
  const _href =
    lng.language === "fi" ? (href as string).replace("[lng]/", "") : href

  return (
    <Link {...props} as={_as} href={_href}>
      {children}
    </Link>
  )
}

export default LangLink
