import { ForbiddenError, UserInputError } from "apollo-server-express"
import { extendType, idArg, intArg, stringArg } from "nexus"

import { isAdmin } from "../../accessControl"
import { buildUserSearch, convertPagination } from "../../util/db-functions"

export const UserQueries = extendType({
  type: "Query",
  definition(t) {
    t.crud.users({
      filtering: false,
      authorize: isAdmin,
    })
    /*t.list.field("users", {
      type: "user",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.prisma.user.findMany()
      },
    })*/

    t.field("user", {
      type: "User",
      args: {
        id: idArg(),
        search: stringArg(),
        upstream_id: intArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, search, upstream_id } = args

        if (!id && !search && !upstream_id) {
          throw new UserInputError(
            "must provide id, search string or upstream_id",
          )
        }

        const user = await ctx.prisma.user.findFirst({
          where: {
            ...buildUserSearch(search),
            id: id ?? undefined,
            upstream_id: upstream_id ?? undefined,
          },
        })
        if (!user) throw new UserInputError("User not found")
        return user
      },
    })

    t.connection("userDetailsContains", {
      type: "User",
      nullable: false,
      additionalArgs: {
        search: stringArg(),
        skip: intArg({ default: 0 }),
      },
      authorize: isAdmin,
      cursorFromNode: (node, _args, _ctx, _info, _) => `cursor:${node?.id}`,
      nodes: async (_, args, ctx) => {
        const { search, first, last, before, after, skip } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        return ctx.prisma.user.findMany({
          ...convertPagination({ first, last, before, after, skip }),
          where: buildUserSearch(search),
        })
      },
      extendConnection(t) {
        t.int("count", {
          args: {
            search: stringArg(),
          },
          resolve: async (_, { search }, ctx) => {
            return ctx.prisma.user.count({
              where: buildUserSearch(search),
            })
          },
        })
      },
    })

    t.nullable.field("currentUser", {
      type: "User",
      args: { search: stringArg() }, // was: email
      resolve: (_, __, ctx) => {
        // FIXME: why don't we search anything? where's this come from?
        // const { search } = args
        return ctx.user ?? null
      },
    })
  },
})
