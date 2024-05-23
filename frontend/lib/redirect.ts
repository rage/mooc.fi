import { NextPageContext as NextContext } from "next"
import Router from "next/router"
import nookies from "nookies"

export interface RedirectType {
  context: NextContext | null
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
  if (savePage && context?.pathname /* context?.req?.originalUrl */) {
    nookies.set(
      context,
      "redirect-back",
      JSON.stringify({ url: context.asPath }),
      {
        maxAge: 20 * 60,
        path: "/",
      },
    )
  }

  if (context?.res?.writeHead && context?.res?.end) {
    // server
    // 303: "See other"
    context.res.writeHead(307, { Location: target })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.push(target, undefined, {
      shallow,
      locale: Router.locale,
    })
  }
}
