import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"

const service = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("service", {
    type: "Service",
    args: {
      service_id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { service_id } = args
      const prisma: Prisma = ctx.prisma

      const service = await prisma.service({ id: service_id })

      return service as NexusGenRootTypes["Service"]
    },
  })
}

const services = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("services", {
    type: "Service",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      return prisma.services()
    },
  })
}

const addServiceQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  service(t)
  services(t)
}

export default addServiceQueries
