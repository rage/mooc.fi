import { AuthenticationError } from "apollo-server-core"
import TmcClient from "../services/tmc"
import { Prisma } from "../generated/prisma-client"
import { Role } from "../accessControl"
import { redisify } from "../services/redis"
import { UserInfo } from "/domain/UserInfo"
import { Context } from "/context"

const fetchUser = async (
  resolve: Function,
  root: any,
  args: Record<string, any>,
  context: Context,
  info: any,
) => {
  const prisma: Prisma = context.prisma
  if (context.userDetails || context.organization) {
    const result = await resolve(root, args, context, info)
    return result
  }
  let rawToken: string | null = null
  if (context.request) {
    rawToken = context.request.get("Authorization")
  } else if (context.connection) {
    rawToken = context.connection.context["Authorization"]
  }

  if (!rawToken) {
    context.role = Role.VISITOR
  } else if (rawToken.startsWith("Basic")) {
    await getOrganization(prisma, rawToken, context)
  } else {
    await getUser(rawToken, context, prisma)
  }

  return await resolve(root, args, context, info)
}

export default fetchUser

const getOrganization = async (
  prisma: Prisma,
  rawToken: string | null,
  context: Context,
) => {
  const secret: string = rawToken?.split(" ")[1] ?? ""

  const org = await prisma.organizations({ where: { secret_key: secret } })
  if (org.length < 1) {
    throw new AuthenticationError("Please log in.")
  }

  context.organization = org[0]
  context.role = Role.ORGANIZATION
}
async function getUser(rawToken: string, context: any, prisma: Prisma) {
  const client = new TmcClient(rawToken)
  // TODO: Does this always make a request?
  const details = await redisify<UserInfo>(client.getCurrentUserDetails(), {
    prefix: "userdetails",
    expireTime: 3600,
    key: rawToken,
  })

  // TODO: the update shouldn't be needed if there's nothing to update

  context.userDetails = details
  context.tmcClient = client

  const {
    id,
    administrator,
    email,
    user_field: { first_name, last_name },
    username,
  } = details

  const existingUser = await prisma.user({ upstream_id: id })

  const prismaDetails = {
    upstream_id: id,
    administrator,
    email: email.trim(),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    username,
  }

  if (!existingUser) {
    context.user = await prisma.createUser(prismaDetails)
  } else {
    context.user = await prisma.updateUser({
      where: { upstream_id: id },
      data: prismaDetails,
    })
  }
  // TODO: this will produce an unique constrait error on
  // creating a new user
  /*context.user = await prisma.upsertUser({
    where: { upstream_id: id },
    create: prismaDetails,
    update: prismaDetails,
  })*/

  if (context.user.administrator) {
    context.role = Role.ADMIN
  } else {
    context.role = Role.USER
  }
}
