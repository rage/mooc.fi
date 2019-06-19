import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg } from "nexus/dist"
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
      checkAccess(ctx)
      const { url, name } = args
      return await prisma.createService({ url: url, name: name })
    },
  })
}

const updateService = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateService", {
    type: "Service",
    args: {
      id: idArg({ required: true }),
      url: stringArg(),
      name: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { url, name, id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.updateService({
        where: { id: id },
        data: { url: url, name: name },
      })
    },
  })
}

const addServiceMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addService(t)
  updateService(t)
}

export default addServiceMutations
