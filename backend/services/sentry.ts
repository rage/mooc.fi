require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import rootdir from "../root"
import * as Sentry from "@sentry/node"
import { RewriteFrames } from "@sentry/integrations"
import * as path from "path"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: `moocfi-backend@${process.env.GIT_COMMIT}`,
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.type === "http") {
      if ((hint?.response?.url ?? "").includes("newrelic.com/agent_listener")) {
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

        const filename = path.basename(frame.filename)
        const fileDir = path.dirname(frame.filename)
        const relativePath = path.relative(rootdir, fileDir)

        frame.filename = `app:///${relativePath}/${filename}`

        return frame
      },
    }),
  ],
})

export { Sentry }
