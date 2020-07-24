import { plugin } from '@nexus/schema'
import { Settings } from './settings'
import { AuthenticationError } from 'apollo-server-errors'
import TmcClient from './service/tmc'
import { UserInfo } from './domain/UserInfo'
import { redisify } from './service/redis'

export enum Role {
  USER,
  ADMIN,
  ORGANIZATION, //for automated scripts, not for accounts
  VISITOR,
}

// upgrades broke typing somehow; anyway, plugin isn't used
export const schemaPlugin: any = ({ prisma, redisClient }: Settings) => {
  return plugin({
    name: 'MOOC.fi Auth Plugin',
    onCreateFieldResolver(config) {
      return async (root, args, ctx, info, next) => {
        if (!ctx._authPlugin) {
          ctx._authPlugin = {
            cache: {},
          }
        }

        const parentType = config.parentTypeConfig.name

        if (!['Query', 'Mutation'].includes(parentType)) {
          return await next(root, args, ctx, info)
        }

        const rawToken = ctx?.headers?.authorization

        if (!rawToken) {
          ctx.details = undefined
          ctx.role = Role.VISITOR
          ctx.user = undefined
          ctx.organization = undefined

          return await next(root, args, ctx, info)
        }

        if (rawToken.startsWith('Basic')) {
          const organization = await prisma.organization.findOne({
            where: {
              secret_key: rawToken.split(' ')?.[1] ?? '',
            },
          })

          if (!organization) {
            throw new AuthenticationError('log in')
          }

          ctx.details = undefined
          ctx.role = Role.ORGANIZATION
          ctx.organization = organization
          ctx.user = undefined

          return await next(root, args, ctx, info)
        }

        let details: UserInfo | null = null
        try {
          const client = new TmcClient(rawToken)
          details = await redisify<UserInfo>(
            async () => await client.getCurrentUserDetails(),
            {
              prefix: 'userdetails',
              expireTime: 3600,
              key: rawToken,
              redisClient,
            }
          )
        } catch (e) {
          console.log('error', e)
        }

        if (!details) {
          throw new AuthenticationError('invalid credentials')
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

        ctx.details = details
        ctx.role = details.administrator ? Role.ADMIN : Role.USER
        ctx.user = user
        ctx.organization = undefined

        return await next(root, args, ctx, info)
      }
    },
  })
}
