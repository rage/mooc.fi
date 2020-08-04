require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: `moocfi-backend@${process.env.GIT_COMMIT}`,
})

export { Sentry }
