import { UserInfo } from "/domain/UserInfo"
import { AuthenticationError } from "apollo-server-express"
import { plugin } from "nexus"

import { User } from "@prisma/client"

import { Role } from "../accessControl"
import { Context } from "../context"
import { redisify } from "../services/redis"
import TmcClient from "../services/tmc"
import { convertUpdate } from "../util/db-functions"
import { isNewToken } from "../util/server-functions"

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
        if (ctx.user || ctx.organization) {
          return await next(root, args, ctx, info)
        }

        const rawToken = ctx.req?.headers?.authorization // connection?

        if (
          !rawToken ||
          rawToken.replace(/(Basic|Bearer)\s/, "") === "undefined"
        ) {
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

const getUserNewToken = async (ctx: Context, rawToken: string) => {
  let user
  try {
    user = await redisify<User | undefined>(
      async () => {
        const { user: _user } =
          (await ctx.prisma.accessToken.findFirst({
            where: {
              access_token: rawToken.replace("Bearer ", ""),
              valid: true,
            },
            select: {
              user: {
                select: {
                  id: true,
                  administrator: true,
                  first_name: true,
                  last_name: true,
                  research_consent: true,
                  upstream_id: true,
                  email: true,
                  username: true,
                  created_at: true,
                  updated_at: true,
                  real_student_number: true,
                  student_number: true,
                },
              },
            },
          })) ?? ({} as any)

        if (!_user) {
          return
        }

        return { ..._user, password: "", password_throttle: "" }
      },
      {
        prefix: "user",
        expireTime: 3600,
        key: rawToken,
      },
    )
  } catch {}

  if (!user) {
    return
  }

  ctx.user = { ...user, password: "", password_throttle: "" }

  if (ctx.user?.administrator) {
    ctx.role = Role.ADMIN
  } else {
    ctx.role = Role.USER
  }
}

const getUser = async (ctx: Context, rawToken: string) => {
  if (isNewToken(rawToken)) {
    return await getUserNewToken(ctx, rawToken)
  }

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
  } catch {
    // console.log("error", e)
  }

  ctx.tmcClient = client
  ctx.userDetails = details ?? undefined // not used anywhere

  if (!details) {
    return
  }

  const id: number = details.id
  const prismaDetails = {
    upstream_id: id,
    administrator: details.administrator,
    email: details.email?.trim(),
    first_name: details.user_field?.first_name?.trim(),
    last_name: details.user_field?.last_name?.trim(),
    username: details.username,
    // password: "password",
  }

  ctx.user = await ctx.prisma.user.upsert({
    where: { upstream_id: id },
    create: prismaDetails,
    update: convertUpdate(prismaDetails),
  })

  if (ctx.user?.administrator) {
    ctx.role = Role.ADMIN
  } else {
    ctx.role = Role.USER
  }
}
