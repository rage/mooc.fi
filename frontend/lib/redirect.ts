import { NextPageContext as NextContext } from "next"
import nookies from "nookies"
import Router from "next/router"

export interface RedirectType {
  context: NextContext
  target: string
  savePage?: boolean
  shallow?: boolean
}

export default function redirect({
  context,
  target,
  savePage = true,
  shallow = true,
}: RedirectType) {
  let language = context?.query?.lng ?? "fi"

  if (savePage && context?.pathname /* context?.req?.originalUrl */) {
    nookies.set(
      context,
      "redirect-back",
      JSON.stringify({ as: context.asPath, href: context.pathname }),
      {
        maxAge: 20 * 60,
        path: "/",
      },
    )
  }

  let sep = ""
  if (!target.startsWith("/")) {
    sep = "/"
  }

  const targetWithLanguage = `/${language}${sep}${target}`

  if (context?.res?.writeHead && context?.res?.end) {
    // server
    // 303: "See other"
    context.res.writeHead(307, { Location: targetWithLanguage })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    if (target !== "/") {
      Router?.router?.push(`/[lng]${sep}${target}`, targetWithLanguage, {
        shallow,
      })
    } else {
      Router?.router?.push("/", "/", { shallow })
    }
  }
}
