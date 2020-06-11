import { stringArg, idArg, intArg } from "@nexus/schema"
// import checkAccess from "../../../accessControl"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { buildSearch } from "../../../util/db-functions"
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
        // checkAccess(ctx)
        const users = await ctx.db.user.findMany({
          where: {
            OR: buildSearch(
              [
                "first_name_contains",
                "last_name_contains",
                "username_contains",
                "email_contains",
              ],
              search ?? "",
            ),
            id,
            upstream_id,
          },
        })
        if (!users.length) throw new UserInputError("User not found")
        return users[0]
      },
    })

    t.field("userDetailsContains", {
      type: "user",
      args: {
        search: stringArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        skip: intArg(),
        before: idArg(),
      },
      resolve: async (_, args, ctx) => {
        // checkAccess(ctx)
        const { search, first, after, last, before, skip } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        return ctx.db.user.findMany({
          where: {
            OR: buildSearch(
              [
                "first_name_contains",
                "last_name_contains",
                "username_contains",
                "email_contains",
              ],
              search ?? "",
            ),
          },
          first,
          last,
          after: { id: after },
          before: { id: before },
          skip,
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
        return ctx.user
      },
    })
  },
})
