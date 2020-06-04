import { Prisma } from "../../generated/prisma-client"
import { stringArg, idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addService = async (t: ObjectDefinitionBlock<"Mutation">) => {
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

const updateService = (t: ObjectDefinitionBlock<"Mutation">) => {
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

const addServiceMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addService(t)
  updateService(t)
}

export default addServiceMutations
