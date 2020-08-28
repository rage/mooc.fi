import rootdir from "../root"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import * as Sentry from "@sentry/node"
import { RewriteFrames } from "@sentry/integrations"
import * as path from "path"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: `moocfi-backend@${process.env.GIT_COMMIT}`,
  beforeBreadcrumb(breadcrumb, _hint) {
    if (breadcrumb.type === "http") {
      if (
        (breadcrumb.data?.url ?? "").includes("newrelic.com/agent_listener")
      ) {
        return null
      }
    }

    return breadcrumb
  },
  integrations: [
    new RewriteFrames({
      root: rootdir,
      iteratee: (frame) => {
        if (!frame?.filename) return frame

        console.log("frame", frame)

        const filename = path.basename(frame.filename)
        const fileDir = path.dirname(frame.filename)
        const relativePath = path.relative(rootdir, fileDir)

        frame.filename = `app:///${relativePath}/${filename}`

        console.log("relativePath", relativePath, "filename", filename)
        return frame
      },
    }),
  ],
})

export { Sentry }
