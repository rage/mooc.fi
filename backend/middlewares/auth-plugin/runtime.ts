import { plugin } from "nexus/plugin"
import TmcClient from "../../services/tmc"
import { redisify } from "../../services/redis"
import { AuthenticationError } from "apollo-server-errors"
import { UserInfo } from "../../domain/UserInfo"
import { Role } from "../../accessControl"
import { Settings } from "./settings"
import { User } from "@prisma/client"
import hashUser from "../../util/hashUser"

export const plugin: RuntimePlugin<Settings, "required"> = (
  settings: Settings,
) => (_project: any) => ({
  context: {
    typeGen: {
      fields: {
        details: "any",
        role: "Role",
        user: "any",
        organization: "any",
      },
    },
    create: async (req: any) => {
      const rawToken = req?.headers?.authorization

      if (!rawToken) {
        return {
          details: undefined,
          role: Role.VISITOR,
          user: undefined,
          organization: undefined,
        }
      }

      const { prisma } = settings

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
          details: undefined,
          role: Role.ORGANIZATION,
          organization,
          user: undefined,
        }
      }

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
      }

      const user = await redisify<User>(
        async () =>
          await prisma.user.upsert({
            where: { upstream_id: id },
            create: prismaDetails,
            update: prismaDetails,
          }),
        {
          prefix: "user",
          expireTime: 3600,
          key: hashUser(prismaDetails),
        },
      )

      return {
        details,
        role: details.administrator ? Role.ADMIN : Role.USER,
        user,
        organization: undefined,
      }
    },
  },
  schema: {
    plugins: [],
  },
})
