import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, intArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { Prisma, User } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { buildSearch } from "../../util/db-functions"
import { NexusGenRootTypes } from "/generated/nexus"

const users = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("users", {
    type: "User",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.users()
    },
  })
}

const user = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("user", {
    type: "User",
    args: {
      id: idArg(),
      search: stringArg(),
      upstream_id: intArg(),
    },
    resolve: async (_, args, ctx) => {
      const { id, search, upstream_id } = args
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      const users: User[] = await prisma.users({
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
          id: id,
          upstream_id: upstream_id,
        },
      })
      if (!users.length) throw new UserInputError("User not found")
      return users[0]
    },
  })
}

const UserDetailsContains = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("userDetailsContains", {
    type: "UserConnection",
    args: {
      search: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { search, first, after, last, before } = args
      if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
        throw new ForbiddenError("Cannot query more than 50 objects")
      }
      const prisma: Prisma = ctx.prisma
      return prisma.usersConnection({
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
        first: first ?? undefined,
        last: last ?? undefined,
        after: after ?? undefined,
        before: before ?? undefined,
      })
    },
  })
}

const currentUser = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("currentUser", {
    type: "User",
    nullable: true,
    args: { search: stringArg() }, // was: email
    resolve: (_, __ /*args */, ctx) => {
      // FIXME: why don't we search anything? where's this come from?
      // const { search } = args
      return ctx.user as NexusGenRootTypes["User"]
    },
  })
}

const addUserQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  users(t)
  currentUser(t)
  user(t)
  UserDetailsContains(t)
}

export default addUserQueries
