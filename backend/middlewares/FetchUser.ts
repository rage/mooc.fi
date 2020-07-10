import { AuthenticationError } from "apollo-server-errors"
import TmcClient from "../services/tmc"
import { Role } from "../accessControl"
import { redisify } from "../services/redis"
import { UserInfo } from "/domain/UserInfo"
import { PrismaClient } from "@prisma/client"
import { IncomingMessage } from "http"
import { NexusContext } from "../context"

const fetchUser = (_config: any) => async (
  root: any,
  args: Record<string, any>,
  ctx: NexusContext,
  info: any,
  next: Function,
) => {
  if (ctx.userDetails || ctx.organization) {
    return await next(root, args, ctx, info)
  }

  const rawToken = ctx.headers?.authorization // connection?

  if (!rawToken) {
    ctx.role = Role.VISITOR
  } else if (rawToken.startsWith("Basic")) {
    await getOrganization(ctx, rawToken)
  } else {
    await getUser(ctx, rawToken)
  }

  return await next(root, args, ctx, info)
}

const getOrganization = async (ctx: NexusContext, rawToken: string | null) => {
  const secret: string = rawToken?.split(" ")[1] ?? ""

  const org = await ctx.db.organization.findMany({
    where: { secret_key: secret },
  })
  if (org.length < 1) {
    throw new AuthenticationError("Please log in.")
  }

  ctx.organization = org[0]
  ctx.role = Role.ORGANIZATION
}

const getUser = async (ctx: NexusContext, rawToken: string) => {
  const client = new TmcClient(rawToken)
  // TODO: Does this always make a request?
  let details: UserInfo | null = null
  try {
    details = await redisify<UserInfo>(client.getCurrentUserDetails(), {
      prefix: "userdetails",
      expireTime: 3600,
      key: rawToken,
    })
  } catch (e) {
    console.log("error", e)
  }

  ctx.tmcClient = client
  ctx.userDetails = details ?? undefined

  if (!details) {
    return
  }

  const id: number = details.id
  const prismaDetails = {
    upstream_id: id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }
  ctx.user = await ctx.db.user.upsert({
    where: { upstream_id: id },
    create: prismaDetails,
    update: prismaDetails,
  })
  if (ctx.user.administrator) {
    ctx.role = Role.ADMIN
  } else {
    ctx.role = Role.USER
  }
}

export default fetchUser

export const contextUser = async (
  req: IncomingMessage,
  prisma: PrismaClient,
) => {
  const rawToken = req.headers.authorization

  if (!rawToken) {
    return {
      role: Role.VISITOR,
      user: undefined,
      organization: undefined,
    }
  }

  if (rawToken.startsWith("Basic")) {
    const organization = await prisma.organization.findOne({
      where: {
        secret_key: rawToken.split(" ")?.[1] ?? "",
      },
    })

    if (!organization) {
      throw new AuthenticationError("log in")
    }

    return {
      role: Role.ORGANIZATION,
      organization,
      user: undefined,
    }
  }

  // TODO: Does this always make a request?
  let details: UserInfo | null = null
  try {
    const client = new TmcClient(rawToken)
    details = await redisify<UserInfo>(client.getCurrentUserDetails(), {
      prefix: "userdetails",
      expireTime: 3600,
      key: rawToken,
    })
  } catch (e) {
    console.log("error", e)
  }

  if (!details) {
    throw new AuthenticationError("invalid credentials")
  }

  const id: number = details.id
  const prismaDetails = {
    upstream_id: id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }

  const user = await prisma.user.upsert({
    where: { upstream_id: id },
    create: prismaDetails,
    update: prismaDetails,
  })

  return {
    role: details.administrator ? Role.ADMIN : Role.USER,
    organization: undefined,
    user,
  }
}

/*const _fetchUser = async (
  resolve: Function,
  root: any,
  args: Record<string, any>,
  context: Context,
  info: any,
) => {
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

const _getOrganization = async (
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
async function _getUser(rawToken: string, context: any, prisma: Prisma) {
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

  console.log("I got here with", existingUser, prismaDetails)
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
  })

  if (context.user.administrator) {
    context.role = Role.ADMIN
  } else {
    context.role = Role.USER
  }
}*/
