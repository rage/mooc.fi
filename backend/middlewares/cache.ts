import { createHash } from "crypto"
import { redisify } from "../services/redis"
import { Context } from "../context"
import { plugin } from "nexus"

export const cachePlugin = () =>
  plugin({
    name: "CachePlugin",
    onCreateFieldResolver(_config: any) {
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
        )
        return res
      }
    },
  })
