import { isProduction } from "../config"
import { Context } from "../context"
// import { log } from "nexus"
import { Sentry } from "../services/sentry"
import { plugin } from "nexus"

export const sentryPlugin = () =>
  plugin({
    name: "SentryPlugin",
    onCreateFieldResolver(config) {
      return async (
        root: any,
        args: Record<string, any>,
        ctx: Context,
        info: any,
        next: Function,
      ) => {
        try {
          const result = await next(root, args, ctx, info)

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
