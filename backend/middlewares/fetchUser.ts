import { plugin } from "nexus"
import { MiddlewareFn } from "nexus/dist/plugin"

import { User } from "@prisma/client"

import { Role } from "../accessControl"
import { Context } from "../context"
import { GraphQLAuthenticationError } from "../lib/errors"
import TmcClient from "../services/tmc"
import { getUserDetailsForToken } from "../services/userDetails"
import { isRootField } from "./rootField"

// Root query fields resolve concurrently, so they share one authentication.
const authentications = new WeakMap<Context, Promise<void>>()

const authenticate = (ctx: Context) => {
  let authentication = authentications.get(ctx)
  if (!authentication) {
    authentication = setContextAuthentication(ctx)
    authentications.set(ctx, authentication)
  }
  return authentication
}

const setContextAuthentication = async (ctx: Context) => {
  const rawToken =
    ctx.req?.headers?.authorization ??
    (ctx.req?.headers?.["Authorization"] as string) ??
    ctx.connectionParams?.authorization ??
    ctx.connectionParams?.["Authorization"] // graphql websocket

  if (!rawToken) {
    ctx.role = Role.VISITOR
  } else if (rawToken.startsWith("Basic")) {
    await setContextOrganization(ctx, rawToken)
  } else {
    await setContextUser(ctx, rawToken)
  }
}

const authMiddlewareFn: MiddlewareFn = async (
  root,
  args,
  ctx: Context,
  info,
  next,
) => {
  await authenticate(ctx)
  return next(root, args, ctx, info)
}

/**
 * Sets `ctx.role` and `ctx.user`/`ctx.organization` from the request's
 * credentials. Runs on root fields only; nested fields and their `authorize`
 * checks see what their root field set.
 */
export const moocfiAuthPlugin = () =>
  plugin({
    name: "moocfiAuthPlugin",
    onCreateFieldResolver(config) {
      return isRootField(config) ? authMiddlewareFn : undefined
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

type SyncedUserFields = Pick<
  User,
  | "upstream_id"
  | "administrator"
  | "email"
  | "first_name"
  | "last_name"
  | "username"
>

const isUserInSync = (user: User, fields: SyncedUserFields) =>
  user.administrator === fields.administrator &&
  user.email === fields.email &&
  user.first_name === fields.first_name &&
  user.last_name === fields.last_name &&
  user.username === fields.username

const setContextUser = async (ctx: Context, rawToken: string) => {
  const details = await getUserDetailsForToken(rawToken, {
    logger: ctx.logger,
  })

  ctx.tmcClient = new TmcClient(rawToken)
  ctx.userDetails = details

  if (!details) {
    return
  }

  const syncedFields: SyncedUserFields = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }

  const existingUser = await ctx.prisma.user.findUnique({
    where: { upstream_id: details.id },
  })

  ctx.user =
    existingUser && isUserInSync(existingUser, syncedFields)
      ? existingUser
      : await ctx.prisma.user.upsert({
          where: { upstream_id: details.id },
          create: syncedFields,
          update: syncedFields,
        })

  ctx.role = ctx.user.administrator ? Role.ADMIN : Role.USER
}
