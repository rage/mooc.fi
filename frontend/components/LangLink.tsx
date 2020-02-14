import React, { useContext } from "react"
import Link, { LinkProps } from "next/link"
import LanguageContext from "/contexes/LanguageContext"
import { parse, format } from "url"

/* interface LangLinkProps extends LinkProps {
  children: JSX.Element | JSX.Element[]
} */

const LangLink: React.FC<LinkProps> = (props): any => {
  const { as: _as, href: _href, children } = props
  const { language } = useContext(LanguageContext)
  const isFi = language === "fi"

  const parsedHref: any =
    typeof _href === "object" ? _href : parse(_href || "", true)
  const parsedAs = (_as || format(parsedHref, { unicode: true })) as string

  const isOutsideLink = parsedAs.startsWith("http")

  if (isOutsideLink) {
    if (children && Array.isArray(children)) {
      const _children: React.ReactNode = React.Children.map(
        children,
        (child, idx) => {
          if (idx === 0) {
            if ((child as any)?.type?.target === "a") {
              return React.cloneElement(child as any, {
                href: parsedAs,
                target: "_blank",
                rel: "noreferrer noopener",
              })
            }
            console.warn(
              "You're trying to link outside the site with a LangLink but you're not providing an <a> tag - just use a regular link or pass a link as the first child!",
            )
          }
          return child
        },
      )

      return _children
    }
    return React.cloneElement(children as any, {
      href: parsedAs,
      target: "_blank",
      rel: "noreferrer noopener",
    })
  }

  let as = isOutsideLink
    ? parsedAs
    : ["en", "fi", "se", "[lng]"].reduce(
        (acc, curr) => acc.replace(`\/${curr}\/`, "/"),
        parsedAs,
      )

  const { path, hash } = parsedHref
  let { href } = parsedHref

  if (path === "/") {
    as = isFi ? "/" : `/${language}/`
    href = isFi ? "/" : "/[lng]/"
  } else if (!path && hash) {
    as = href = hash
  } else if (!isOutsideLink) {
    as = `/${language}${as}`.replace(/\/$/, "")
    href = `/[lng]${href.replace("/[lng]", "")}`.replace(/\/+/g, "/")
  }

  return (
    <Link {...props} as={as} href={href}>
      {children}
    </Link>
  )
}

export default LangLink
