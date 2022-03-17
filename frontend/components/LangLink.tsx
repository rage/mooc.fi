import {
  Children,
  cloneElement,
  PropsWithChildren,
  useContext,
} from "react"

import LanguageContext from "/contexts/LanguageContext"
import Link, { LinkProps } from "next/link"
import {
  format,
  parse,
} from "url"

function LangLink(props: PropsWithChildren<LinkProps>): any {
  const { as: _as, href: _href, children } = props
  const { language } = useContext(LanguageContext)
  const isFi = language === "fi"

  const parsedHref: any =
    typeof _href === "object" ? _href : parse(_href || "", true)
  const parsedAs = (_as || format(parsedHref, { unicode: true })) as string
  const isOutsideLink = parsedAs.startsWith("http")

  if (isOutsideLink) {
    if (children && Array.isArray(children)) {
      return Children.map(children, (child, idx) => {
        if (idx === 0) {
          if ((child as any)?.type?.target === "a") {
            return cloneElement(child as any, {
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
      })
    }
    return (
      cloneElement(children as any, {
        href: parsedAs,
        target: "_blank",
        rel: "noreferrer noopener",
      }) ?? null
    )
  }

  let { href } = parsedHref
  const { path } = parsedHref

  if (path === "/") {
    href = isFi ? "/" : `/${language}`
  } else if (!isOutsideLink) {
    href = `/${language}${href}`
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  )
}

export default Link
