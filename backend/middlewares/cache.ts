import { createHash } from "crypto"
import { redisify } from "..//services/redis"
import { Context } from "/context"

const fetchUser = async (
  resolve: Function,
  root: any,
  args: Record<string, any>,
  context: Context,
  info: any,
) => {
  let rawToken: string | null = null
  if (context.request) {
    rawToken = context.request.get("Authorization")
  } else if (context.connection) {
    rawToken = context.connection.context["Authorization"]
  }
  if (root || info.parentType.toString() !== "Query" || rawToken) {
    return await resolve(root, args, context, info)
  }

  const key = `${info.fieldName}-${JSON.stringify(
    info.fieldNodes,
  )}-${JSON.stringify(args)}`
  let hash = createHash("sha512")
    .update(key)
    .digest("hex")
  const res = await redisify<any>(
    () => {
      return resolve(root, args, context, info)
    },
    {
      prefix: "graphql-response",
      expireTime: 300,
      key: hash,
    },
  )
  return res
}

export default fetchUser
