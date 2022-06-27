import { plugin } from "nexus"

const newrelic = require("newrelic")

export const newRelicPlugin = () =>
  plugin({
    name: "NewRelicPlugin",
    onCreateFieldResolver(config: any) {
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
