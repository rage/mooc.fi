import { arg, extendType, idArg, intArg, list, nonNull, stringArg } from "nexus"
import { type NexusGenEnums } from "nexus-typegen"

import { User } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { ForbiddenError, UserInputError } from "../../lib/errors"
import { buildUserSearch } from "../../util/db-functions"
import { notEmpty } from "../../util/notEmpty"

export const UserQueries = extendType({
  type: "Query",
  definition(t) {
    t.crud.users({
      filtering: false,
      authorize: isAdmin,
    })

    t.field("user", {
      type: "User",
      args: {
        id: idArg(),
        search: stringArg(),
        upstream_id: intArg(),
      },
      authorize: isAdmin,
      validate: (_, { id, search, upstream_id }) => {
        if (!id && !search && !upstream_id) {
          throw new UserInputError(
            "must provide id, search string or upstream_id",
          )
        }
      },
      resolve: async (_, { id, search, upstream_id }, ctx) => {
        const user = await ctx.prisma.user.findFirst({
          where: {
            ...(search ? { OR: buildUserSearch(search) } : {}),
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
      validateArgs({ first, last }) {
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }
      },
      cursorFromNode: (node, _args, _ctx, _info, _) => `cursor:${node?.id}`,
      nodes: async (_, args, ctx) => {
        const { search, first, last, before, after, skip } = args

        return ctx.prisma.user.findManyWithPagination({
          where: {
            OR: buildUserSearch(search),
          },
          first,
          last,
          before: before ? { id: before } : undefined,
          after: after ? { id: after } : undefined,
          skip: skip ?? undefined,
        })
      },
      extendConnection(t) {
        t.int("count", {
          args: {
            search: stringArg(),
          },
          resolve: async (_, { search }, ctx) => {
            return ctx.prisma.user.count({
              where: {
                OR: buildUserSearch(search),
              },
            })
          },
        })
      },
    })

    t.field("currentUser", {
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

export const UserSubscriptions = extendType({
  type: "Subscription",
  definition(t) {
    t.nonNull.field("userSearch", {
      type: "UserSearch",
      args: {
        search: nonNull(stringArg()),
        fields: list(nonNull(arg({ type: "UserSearchField" }))),
      },
      authorize: isAdmin,
      subscribe(_, { search, fields }, ctx) {
        const queries = buildUserSearch(search, fields ?? undefined) ?? []
        const fieldCount = queries.length

        let users: Array<User> = []

        return (async function* () {
          let fieldIndex = 1

          for (const query of queries) {
            let field: NexusGenEnums["UserSearchField"]
            const fields = Object.keys(query)
            if (["first_name", "last_name"].every((f) => fields.includes(f))) {
              field = "full_name"
            } else {
              field = fields[0] as NexusGenEnums["UserSearchField"]
            }
            const fieldValue = Object.values(query)
              .map((q) =>
                q !== null && typeof q === "object" && "contains" in q
                  ? q.contains
                  : q,
              )
              .filter(notEmpty)
              .join(", ")
            const res = await ctx.prisma.user.findMany({
              where: query,
            })
            const newUsers = res.filter(
              (u) => !users.find((u2) => u2.id === u.id),
            )
            const allMatchIds = res.map((u) => u.id)
            users = users.concat(newUsers)

            yield {
              field,
              fieldValue,
              search,
              count: users.length,
              fieldIndex,
              fieldCount,
              fieldResultCount: res.length,
              fieldUniqueResultCount: newUsers.length,
              matches: newUsers,
              allMatchIds,
              finished: fieldIndex === fieldCount,
            }
            fieldIndex++
          }
        })()
      },
      resolve(eventData) {
        return eventData
      },
    })
  },
})
