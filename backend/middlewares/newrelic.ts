import { plugin } from "nexus"

const newrelic = require("newrelic")

export const newRelicPlugin = () =>
  plugin({
    name: "NewRelicPlugin",
    onCreateFieldResolver(config) {
      return async (root, args, ctx, info, next) => {
        try {
          if (!root) {
            newrelic.setTransactionName(
              `graphql/${config.parentTypeConfig.name}.${config.fieldConfig.name}`,
            )
          }

          const result = await next(root, args, ctx, info) // NOSONAR can be async, even if sonar doesn't pick it up

          return result
        } catch (error) {
          newrelic.noticeError(error)

          return next(root, args, ctx, info)
        }
      }
    },
  })
