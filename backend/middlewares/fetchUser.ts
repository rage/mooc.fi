import { AuthenticationError } from "apollo-server-express"
import { plugin } from "nexus"

import { Role } from "../accessControl"
import { Context } from "../context"
import { redisify } from "../services/redis"
import TmcClient from "../services/tmc"
import { UserInfo } from "/domain/UserInfo"

export const moocfiAuthPlugin = () =>
  plugin({
    name: "moocfiAuthPlugin",
    onCreateFieldResolver() {
      return async (root, args, ctx, info, next) => {
        if (ctx.userDetails || ctx.organization) {
          return next(root, args, ctx, info)
        }

        const rawToken = ctx.req?.headers?.authorization // connection?

        if (!rawToken) {
          ctx.role = Role.VISITOR
        } else if (rawToken.startsWith("Basic")) {
          await setContextOrganization(ctx, rawToken)
        } else {
          await setContextUser(ctx, rawToken)
        }

        return next(root, args, ctx, info)
      }
    },
  })

const setContextOrganization = async (
  ctx: Context,
  rawToken: string | null,
) => {
  const secret: string = rawToken?.split(" ")[1] ?? ""

  const org = await ctx.prisma.organization.findUnique({
    where: { secret_key: secret },
  })
  if (!org) {
    throw new AuthenticationError("Please log in.")
  }

  ctx.organization = org
  ctx.role = Role.ORGANIZATION
}

const setContextUser = async (ctx: Context, rawToken: string) => {
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
      {
        logger: ctx.logger,
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
  }

  ctx.user = await ctx.prisma.user.upsert({
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
