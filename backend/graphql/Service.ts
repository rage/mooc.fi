import { UserInputError } from "apollo-server-express"
import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

import { isAdmin } from "../accessControl"

export const Service = objectType({
  name: "Service",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.url()
    t.model.exercises()
    t.model.user_course_service_progresses()
    t.model.courses()
  },
})

export const ServiceQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("service", {
      type: "Service",
      args: {
        id: idArg(),
        service_id: idArg(), // old parameter for compatibility
      },
      authorize: isAdmin,
      resolve: async (_, { id, service_id }, ctx) => {
        if (service_id && id) {
          throw new UserInputError(
            "service_id parameter will be deprecated, use id in the future; don't use both",
          )
        }

        return ctx.prisma.service.findUnique({
          where: { id: service_id ?? id },
        })
      },
    })

    t.crud.services({
      pagination: false,
      authorize: isAdmin,
    })
  },
})

export const ServiceMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addService", {
      type: "Service",
      args: {
        url: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { url, name } = args

        return await ctx.prisma.service.create({
          data: {
            url,
            name,
          },
        })
      },
    })

    t.field("updateService", {
      type: "Service",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        name: stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { url, name, id } = args

        if (!url && !name) {
          throw new UserInputError("No fields to update")
        }

        return ctx.prisma.service.update({
          where: { id },
          data: {
            ...(url && { url }),
            ...(name && { name }),
          },
        })
      },
    })
  },
})
