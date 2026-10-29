import { plugin } from "nexus"

import { Context } from "../context"
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
          }, args: ${JSON.stringify(args)}`,
        )

        return next(root, args, ctx, info)
      }
    },
  })
