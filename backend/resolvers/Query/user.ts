import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const users = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("users", {
    type: "User",
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.users()
    },
  })
}

const currentUser = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("currentUser", {
    type: "User",
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
}

export default addUserQueries
