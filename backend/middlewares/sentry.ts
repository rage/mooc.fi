// import { log } from "nexus"
import { Sentry } from "../services/sentry"

const sentry = (config: any) => async (
  root: any,
  args: Record<string, any>,
  context: Context,
  info: any,
  next: Function,
) => {
  try {
    const result = await next(root, args, context, info)

    return result
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      Sentry.withScope((scope) => {
        scope.setFingerprint(["{{ default }}", config.fieldConfig.name])
        scope.setExtra("type", config.parentTypeConfig.name)
        scope.setExtra("field", config.fieldConfig.name)
        scope.setExtra("args", args)
        scope.setUser({ id: context.user?.id })

        Sentry.captureException(error)
      })
    }

    console.error("error", { error }) // TODO: fix log

    return error
  }
}

export default sentry
