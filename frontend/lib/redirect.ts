import { NextPageContext as NextContext } from "next"
import Router from "next/router"
import nookies from "nookies"

export interface RedirectType {
  context?: NextContext
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
  if (context?.res?.headersSent) {
    return
  }

  if (savePage && context?.pathname) {
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

  if (context?.res && context.asPath !== target) {
    // server
    // 303: "See other"
    context.res.writeHead(307, { Location: target })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.push(target, target, {
      shallow,
    })
  }
}
