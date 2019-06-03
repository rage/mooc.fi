import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addService = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addService", {
    type: "Service",
    args: {
      url: stringArg({ required: true }),
      name: stringArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const prisma: Prisma = ctx.prisma
      checkAccess(ctx, { allowOrganizations: false })
      const { url, name } = args
      return await prisma.createService({ url: url, name: name })
    },
  })
}

const addServiceMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addService(t)
}

export default addServiceMutations
