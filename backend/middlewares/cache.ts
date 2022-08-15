import { createHash } from "crypto"

import { plugin } from "nexus"

import { Context } from "../context"
import { redisify } from "../services/redis"

export const cachePlugin = () =>
  plugin({
    name: "CachePlugin",
    onCreateFieldResolver(_: any) {
      return async (
        root: any,
        args: Record<string, any>,
        context: Context,
        info: any,
        next: Function,
      ) => {
        let rawToken: string | undefined = undefined
        if (context.req?.headers) {
          rawToken = context?.req?.headers?.authorization
        } /* else if (context.req?.connection) {
        rawToken = context.req?.connection.context["Authorization"]
      }*/
        if (root || info.parentType.toString() !== "Query" || rawToken) {
          return await next(root, args, context, info)
        }

        const key = `${info.fieldName}-${JSON.stringify(
          info.fieldNodes,
        )}-${JSON.stringify(args)}`

        let hash = createHash("sha512").update(key).digest("hex")

        const res = await redisify<any>(
          async () => await next(root, args, context, info),
          {
            prefix: "graphql-response",
            expireTime: 300,
            key: hash,
          },
          {
            logger: context.logger,
          },
        )
        return res
      }
    },
  })
