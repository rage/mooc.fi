import { createHash } from "crypto"
import { redisify } from "../services/redis"

const cache = (_config: any) => async (
  root: any,
  args: Record<string, any>,
  context: NexusContext,
  info: any,
  next: Function,
) => {
  let rawToken: string | undefined = undefined
  if (context.headers) {
    rawToken = context.headers.authorization
  } /* else if (context.connection) {
    rawToken = context.connection.context["Authorization"]
  }*/
  if (root || info.parentType.toString() !== "Query" || rawToken) {
    return await next(root, args, context, info)
  }

  const key = `${info.fieldName}-${JSON.stringify(
    info.fieldNodes,
  )}-${JSON.stringify(args)}`

  let hash = createHash("sha512").update(key).digest("hex")
  const res = await redisify<any>(next(root, args, context, info), {
    prefix: "graphql-response",
    expireTime: 300,
    key: hash,
  })
  return res
}

export default cache
