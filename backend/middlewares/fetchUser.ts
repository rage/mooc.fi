import { plugin } from "nexus"
import { MiddlewareFn } from "nexus/dist/plugin"

import { Role } from "../accessControl"
import { Context } from "../context"
import { GraphQLAuthenticationError } from "../lib/errors"
import { redisify } from "../services/redis"
import TmcClient from "../services/tmc"
import { UserInfo } from "/domain/UserInfo"

const authMiddlewareFn: MiddlewareFn = async (
  root,
  args,
  ctx: Context,
  info,
  next,
) => {
  if (ctx.userDetails || ctx.organization) {
    return next(root, args, ctx, info)
  }

  const rawToken =
    ctx.req?.headers?.authorization ??
    (ctx.req?.headers?.["Authorization"] as string) ??
    ctx.connectionParams?.authorization ??
    ctx.connectionParams?.["Authorization"] // graphql websocket
  // connection?

  if (!rawToken) {
    ctx.role = Role.VISITOR
  } else if (rawToken.startsWith("Basic")) {
    await setContextOrganization(ctx, rawToken)
  } else {
    await setContextUser(ctx, rawToken)
  }

  return next(root, args, ctx, info)
}

export const moocfiAuthPlugin = () =>
  plugin({
    name: "moocfiAuthPlugin",
    onCreateFieldResolver() {
      return authMiddlewareFn
    },
    onCreateFieldSubscribe() {
      return authMiddlewareFn
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
    throw new GraphQLAuthenticationError("Please log in.")
  }

  ctx.organization = org
  ctx.role = Role.ORGANIZATION
}

let prevToken: string | undefined

const setContextUser = async (ctx: Context, rawToken: string) => {
  // TODO: provide mock for tests
  const client = new TmcClient(rawToken)
  const hasTokenChanged = prevToken !== rawToken

  prevToken = rawToken

  // TODO: Does this always make a request?
  let details: UserInfo | null = null
  let isCached = true

  try {
    details = await redisify<UserInfo>(
      async () => {
        isCached = false
        return await client.getCurrentUserDetails()
      },
      {
        prefix: "userdetails",
        expireTime: 3600,
        key: rawToken,
      },
      ctx,
    )
  } catch (e) {
    ctx.logger.warn("Error fetching user details", e)
  }

  ctx.tmcClient = client
  ctx.userDetails = details ?? undefined

  if (!details) {
    return
  }

  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }

  if (!hasTokenChanged && ctx.user && ctx.role) {
    if (
      isCached ||
      (ctx.user.id &&
        ctx.user.administrator === prismaDetails.administrator &&
        ctx.user.email === prismaDetails.email &&
        ctx.user.first_name === prismaDetails.first_name &&
        ctx.user.last_name === prismaDetails.last_name)
    ) {
      return
    }
  }

  ctx.user = await ctx.prisma.user.upsert({
    where: { upstream_id: details.id },
    create: prismaDetails,
    update: prismaDetails,
  })
  if (ctx.user.administrator) {
    ctx.role = Role.ADMIN
  } else {
    ctx.role = Role.USER
  }
}
