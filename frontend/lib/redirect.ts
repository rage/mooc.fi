import { NextPageContext as NextContext } from "next"
import nookies from "nookies"
import Router from "next/router"

export default (context: NextContext, target: string, savePage = true) => {
  let language = context?.query?.lng ?? "fi"

  // @ts-ignore
  if (savePage && context?.req?.originalUrl) {
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
  // @ts-ignore
  const targetWithLanguage = `/${language}${sep}${target}`
  if (context?.res?.writeHead && context?.res?.end) {
    // server
    // 303: "See other"
    context.res.writeHead(307, { Location: targetWithLanguage })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    // FIXME: (?) add other fields to push
    if (target !== "/") {
      Router.push(`/[lng]${sep}${target}`, targetWithLanguage, {
        shallow: true,
      })
    } else {
      Router.push("/", "/", { shallow: true })
    }
  }
}
