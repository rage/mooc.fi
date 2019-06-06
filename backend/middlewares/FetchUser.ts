import { AuthenticationError } from "apollo-server-core"
import TmcClient from "../services/tmc"
import { Prisma } from "../generated/prisma-client"

const fetchUser = async (resolve, root, args, context, info) => {
  const prisma: Prisma = context.prisma
  if (context.userDetails || context.organization) {
    const result = await resolve(root, args, context, info)
    return result
  }
  let rawToken: string = null
  if (context.request) {
    rawToken = context.request.get("Authorization")
  } else if (context.connection) {
    rawToken = context.connection.context["Authorization"]
  }
  if (!rawToken) {
    return new AuthenticationError("Please log in.")
  }
  if (rawToken.startsWith("Basic")) {
    let org
    try {
      const secret: string = rawToken.split(" ")[1]
      org = await prisma.organizations({ where: { secret_key: secret } })
      org = org[0]
    } catch (e) {
      return new AuthenticationError("Please log in.")
    }
    context.organization = org
    return await resolve(root, args, context, info)
  }
  const client = new TmcClient(rawToken)
  const details = await client.getCurrentUserDetails()
  context.userDetails = details
  context.tmcClient = client

  const id: number = details.id
  const prismaDetails = {
    upstream_id: id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }
  context.user = await prisma.upsertUser({
    where: { upstream_id: id },
    create: prismaDetails,
    update: prismaDetails,
  })

  const result = await resolve(root, args, context, info)
  return result
}

export default fetchUser
