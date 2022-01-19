import * as path from "path"

import { RewriteFrames } from "@sentry/integrations"
import * as Sentry from "@sentry/node"

import { GIT_COMMIT, SENTRY_DSN } from "../config"
import rootdir from "../root"

Sentry.init({
  dsn: SENTRY_DSN,
  release: `moocfi-backend@${GIT_COMMIT}`,
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
