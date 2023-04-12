import { createHash } from "crypto"

import { plugin } from "nexus"

import { redisify } from "../services/redis"

export const cachePlugin = () =>
  plugin({
    name: "CachePlugin",
    onCreateFieldResolver() {
      return async (root, args, context, info, next) => {
        let rawToken: string | undefined = undefined
        if (context.req?.headers) {
          rawToken = context?.req?.headers?.authorization
        } /* else if (context.req?.connection) {
        rawToken = context.req?.connection.context["Authorization"]
      }*/
        if (root || info.parentType.toString() !== "Query" || rawToken) {
          return next(root, args, context, info)
        }

        const key = `${info.fieldName}-${JSON.stringify(
          info.fieldNodes,
        )}-${JSON.stringify(args)}`

        const hash = createHash("sha512").update(key).digest("hex")

        const res = await redisify<any>(
          async () => next(root, args, context, info),
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
    onCreateFieldSubscribe() {
      return async (root, args, ctx, info, next) => {
        const key = `${info.fieldName}-${JSON.stringify(
          info.fieldNodes,
        )}-${JSON.stringify(args)}`

        const hash = createHash("sha512").update(key).digest("hex")

        const res = await redisify<any>(
          async () => {
            const subscriptionRes = []
            const maybeSubscription = await next(root, args, ctx, info) // NOSONAR: is async

            if (
              maybeSubscription &&
              typeof maybeSubscription[Symbol.asyncIterator] === "function"
            ) {
              for await (const item of maybeSubscription) {
                subscriptionRes.push(item)
              }
            } else {
              return maybeSubscription
            }

            return subscriptionRes
          },
          {
            prefix: "graphql-subscription",
            expireTime: 60,
            key: hash,
          },
          {
            logger: ctx.logger,
          },
        )

        return (async function* () {
          for (const item of res) {
            yield item
          }
        })()
      }
    },
  })
