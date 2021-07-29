import { AuthenticationError } from "apollo-server-core"
import TmcClient from "../services/tmc"
import { Role } from "../accessControl"
import { redisify } from "../services/redis"
import { UserInfo } from "/domain/UserInfo"
import { PrismaClient } from "@prisma/client"
import { Context } from "../context"
import { plugin } from "nexus"
import { convertUpdate } from "../util/db-functions"

export const moocfiAuthPlugin = () =>
  plugin({
    name: "moocfiAuthPlugin",
    onCreateFieldResolver(_config: any) {
      return async (
        root: any,
        args: Record<string, any>,
        ctx: Context,
        info: any,
        next: Function,
      ) => {
        if (ctx.userDetails || ctx.organization) {
          return await next(root, args, ctx, info)
        }

        const rawToken = ctx.req?.headers?.authorization // connection?

        if (!rawToken) {
          ctx.role = Role.VISITOR
        } else if (rawToken.startsWith("Basic")) {
          await getOrganization(ctx, rawToken)
        } else {
          await getUser(ctx, rawToken)
        }

        return await next(root, args, ctx, info)
      }
    },
  })

const getOrganization = async (ctx: Context, rawToken: string | null) => {
  const secret: string = rawToken?.split(" ")[1] ?? ""

  const org = await ctx.prisma.organization.findFirst({
    where: { secret_key: secret },
  })
  if (!org) {
    throw new AuthenticationError("Please log in.")
  }

  ctx.organization = org
  ctx.role = Role.ORGANIZATION
}

const getUser = async (ctx: Context, rawToken: string) => {
  const client = new TmcClient(rawToken)
  // TODO: Does this always make a request?
  let details: UserInfo | null = null

  try {
    details = await redisify<UserInfo>(
      async () => await client.getCurrentUserDetails(),
      {
        prefix: "userdetails",
        expireTime: 3600,
        key: rawToken,
      },
    )
  } catch (e) {
    // console.log("error", e)
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
    password: "password",
  }

  ctx.user = await ctx.prisma.user.upsert({
    where: { upstream_id: id },
    create: prismaDetails,
    update: convertUpdate(prismaDetails),
  })
  if (ctx.user.administrator) {
    ctx.role = Role.ADMIN
  } else {
    ctx.role = Role.USER
  }
}

// this is the one suitable for context, not used for now
export const contextUser = async (
  req: any, // was: IncomingMessage, but somehow it's wrapped in req
  prisma: PrismaClient,
) => {
  // TODO/FIXME:
  // Future versions of nexus seem to wrap this, so its req?.req?...
  const rawToken = req?.headers?.authorization

  if (!rawToken) {
    return {
      role: Role.VISITOR,
      user: undefined,
      organization: undefined,
    }
  }

  if (rawToken.startsWith("Basic")) {
    const organization = await prisma.organization.findUnique({
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
    details = await redisify<UserInfo>(
      async () => await client.getCurrentUserDetails(),
      {
        prefix: "userdetails",
        expireTime: 3600,
        key: rawToken,
      },
    )
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
    password: "password",
  }

  const user = await prisma.user.upsert({
    where: { upstream_id: id },
    create: prismaDetails,
    update: convertUpdate(prismaDetails),
  })

  return {
    role: details.administrator ? Role.ADMIN : Role.USER,
    organization: undefined,
    user,
  }
}
