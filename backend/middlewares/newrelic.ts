import { plugin } from "nexus"

import { catchResolverError } from "./catchResolverError"
import { isRootField } from "./rootField"

const newrelic = require("newrelic")

export const newRelicPlugin = () =>
  plugin({
    name: "NewRelicPlugin",
    onCreateFieldResolver(config) {
      const transactionName = isRootField(config)
        ? `graphql/${config.parentTypeConfig.name}.${config.fieldConfig.name}`
        : undefined

      return (root, args, ctx, info, next) => {
        if (transactionName) {
          newrelic.setTransactionName(transactionName)
        }

        return catchResolverError(
          () => next(root, args, ctx, info),
          (error) => {
            newrelic.noticeError(error)
            throw error
          },
        )
      }
    },
  })
