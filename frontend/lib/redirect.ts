import Nexti18next from "../i18n"
import { NextContext } from "next"

export default (context: NextContext, target: string) => {
  if (context.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Nexti18next.Router.replace(target)
  }
}
