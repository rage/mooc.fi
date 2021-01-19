// import { log } from "nexus"
import { Sentry } from "../services/sentry"
import { Context } from "../context"
import { plugin } from "nexus"

export const sentryPlugin = () =>
  plugin({
    name: "SentryPlugin",
    onCreateFieldResolver(config: any) {
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
          if (process.env.NODE_ENV === "production") {
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
