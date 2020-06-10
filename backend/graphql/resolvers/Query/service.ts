import { Prisma } from "../../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const service = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("service", {
    type: "service",
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

const services = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("services", {
    type: "service",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      return prisma.services()
    },
  })
}

const addServiceQueries = (t: ObjectDefinitionBlock<"Query">) => {
  service(t)
  services(t)
}

export default addServiceQueries
