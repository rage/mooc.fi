import { plugin } from "nexus"

import { isProduction } from "../config"
import { Context } from "../context"
import { Sentry } from "../services/sentry"

export const sentryPlugin = () =>
  plugin({
    name: "SentryPlugin",
    onCreateFieldResolver(config) {
      return async (root, args, ctx: Context, info, next) => {
        try {
          const result: any = await next(root, args, ctx, info) // NOSONAR: can be async, even if sonar doesn't pick it up

          return result
        } catch (error) {
          if (isProduction) {
            Sentry.withScope((scope) => {
              scope.setFingerprint(["{{ default }}", config.fieldConfig.name])
              scope.setExtra("type", config.parentTypeConfig.name)
              scope.setExtra("field", config.fieldConfig.name)
              scope.setExtra("args", args)
              scope.setUser({ id: ctx.user?.id })

              Sentry.captureException(error)
            })
          }

          ctx?.logger?.error("error", { error })

          return error
        }
      }
    },
  })
