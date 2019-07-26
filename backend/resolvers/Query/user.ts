import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, intArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { Prisma, User } from "../../generated/prisma-client"
import { UserInputError } from "apollo-server-core"

const users = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("users", {
    type: "User",
    resolve: (_, args, ctx) => {
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
      email: stringArg(),
      upstream_id: intArg(),
    },
    resolve: async (_, args, ctx) => {
      const { id, email, upstream_id } = args
      const prisma: Prisma = ctx.prisma
      const users: User[] = await prisma.users({
        where: {
          email: email,
          id: id,
          upstream_id: upstream_id,
        },
      })
      if (!users.length) throw new UserInputError("User not found")
      return users[0]
    },
  })
}

const UserEmailContains = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("userEmailContains", {
    type: "User",
    args: {
      email: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
    },
  })
}

const currentUser = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("currentUser", {
    type: "User",
    nullable: true,
    args: { email: stringArg() },
    resolve: (_, args, ctx) => {
      const { email } = args
      return ctx.user
    },
  })
}

const addUserQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  users(t)
  currentUser(t)
  user(t)
  UserEmailContains(t)
}

export default addUserQueries
