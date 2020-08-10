import { plugin } from "@nexus/schema"

const newrelic = require("newrelic")

function newrelicPlugin() {
  return plugin({
    name: "New Relic Plugin",
    onCreateFieldResolver(config) {
      return async (root, args, ctx, info, next) => {
        try {
          if (!root) {
            newrelic.setTransactionName(
              `graphql/${config.parentTypeConfig.name}.${config.fieldConfig.name}`,
            )
          }

          const result = await next(root, args, ctx, info)

          return result
        } catch (error) {
          newrelic.noticeError(error)

          return await next(root, args, ctx, info)
        }
      }
    },
  })
}

export { newrelicPlugin }
