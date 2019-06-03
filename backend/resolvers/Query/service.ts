import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"

const service = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("service", {
    type: "Service",
    args: {
      service_id: idArg(),
    },
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { service_id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.service({ id: service_id })
    },
  })
}

const services = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("services", {
    type: "Service",
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
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
