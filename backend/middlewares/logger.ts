import { plugin } from "nexus"

import { Context } from "../context"

export const loggerPlugin = () =>
  plugin({
    name: "LoggerPlugin",
    onCreateFieldResolver(_config) {
      return async (
        root: any,
        args: any,
        ctx: Context,
        info: any,
        next: any,
      ) => {
        // only log root level query/mutation, not fields queried
        if (!info.path?.prev) {
          ctx?.logger?.info(
            `${info.operation.operation}: ${
              info.path.key
            }, args: ${JSON.stringify(args)}`,
          )
        }

        return await next(root, args, ctx, info)
      }
    },
  })
