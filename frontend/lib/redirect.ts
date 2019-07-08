import Nexti18next from "../i18n"
import { NextContext } from "next"
import nookies from "nookies"

export default (context: NextContext, target: string, savePage = false) => {
  if (savePage) {
    // @ts-ignore
    nookies.set(context, "redirect-back", context.req.originalUrl, {
      maxAge: 20 * 60,
      path: "/",
    })
  }
  let sep = ""
  if (!target.startsWith("/")) {
    sep = "/"
  }
  // @ts-ignore
  const targetWithLanguage = `/${context.req.language}${sep}${target}`
  if (context.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: targetWithLanguage })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Nexti18next.Router.replace(targetWithLanguage)
  }
}
