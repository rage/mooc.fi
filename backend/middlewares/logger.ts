import { plugin } from "nexus"

import { Context } from "../context"
import { redactArgs } from "./redactArgs"
import { isRootField } from "./rootField"

export const loggerPlugin = () =>
  plugin({
    name: "LoggerPlugin",
    onCreateFieldResolver(config) {
      if (!isRootField(config)) {
        return
      }
      return (root, args, ctx: Context, info, next) => {
        ctx?.logger?.info(
          `${info.operation.operation}: ${
            info.path.key
          }, args: ${JSON.stringify(redactArgs(args))}`,
        )

        return next(root, args, ctx, info)
      }
    },
  })
