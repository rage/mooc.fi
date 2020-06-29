import { stringArg, idArg, intArg } from "@nexus/schema"
import { UserInputError, ForbiddenError } from "apollo-server-errors"
import { buildSearch, convertPagination } from "../../../util/db-functions"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.users()
    /*t.list.field("users", {
      type: "user",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.user.findMany()
      },
    })*/

    t.field("user", {
      type: "user",
      args: {
        id: idArg(),
        search: stringArg(),
        upstream_id: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id, search, upstream_id } = args

        if (!id && !search && !upstream_id) {
          throw new UserInputError(
            "must provide id, search string or upstream_id",
          )
        }

        const users = await ctx.db.user.findMany({
          where: {
            OR: buildSearch(search ?? ""),
            id: id ?? undefined,
            upstream_id: upstream_id ?? undefined,
          },
        })
        if (!users.length) throw new UserInputError("User not found")
        return users[0]
      },
    })

    t.connectionField("userDetailsContains", {
      type: "user",
      additionalArgs: {
        search: stringArg(),
        after: stringArg(),
        skip: intArg({ default: 0 }),
      },
      nodes: async (_, args, ctx) => {
        const { search, first, last, before, after, skip } = args

        console.log("args", args)
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        return ctx.db.user.findMany({
          ...convertPagination({ first, last, before, after, skip }),
          where: {
            OR: buildSearch(
              ["first_name", "last_name", "username", "email"],
              search ?? "",
            ),
          },
        })
      },
      extendConnection(t) {
        t.int("count", {
          args: {
            search: stringArg(),
          },
          resolve: (_, { search }, ctx) => {
            return ctx.db.user.count({
              where: {
                OR: buildSearch(
                  ["first_name", "last_name", "username", "email"],
                  search ?? "",
                ),
              },
            })
          },
        })
      },
    })

    t.field("currentUser", {
      type: "user",
      nullable: true,
      args: { search: stringArg() }, // was: email
      resolve: (_, __, ctx) => {
        // FIXME: why don't we search anything? where's this come from?
        // const { search } = args
        return ctx.user ?? null
      },
    })
  },
})
