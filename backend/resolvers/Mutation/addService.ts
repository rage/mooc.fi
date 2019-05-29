import { ForbiddenError } from "apollo-server-core"
import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import { add } from "winston"

const addService = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addService", {
    type: "Service",
    args: {
      url: stringArg({ required: true }),
      name: stringArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const prisma: Prisma = ctx.prisma
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { url, name } = args
      return await prisma.createService({ url: url, name: name })
    },
  })
}

const addServiceMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addService(t)
}

export default addServiceMutations
