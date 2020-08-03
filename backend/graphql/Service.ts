import { schema } from "nexus"

import { isAdmin } from "../accessControl"

schema.objectType({
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

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("service", {
      type: "Service",
      args: {
        service_id: schema.idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { service_id }, ctx) =>
        ctx.db.service.findOne({ where: { id: service_id } }),
    })

    t.crud.services({
      pagination: false,
      authorize: isAdmin,
    })

    /*t.list.field("services", {
      type: "service",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)

        return ctx.db.service.findMany()
      },
    })*/
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addService", {
      type: "Service",
      args: {
        url: schema.stringArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { url, name } = args

        return await ctx.db.service.create({
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
        id: schema.idArg({ required: true }),
        url: schema.stringArg(),
        name: schema.stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { url, name, id } = args

        return ctx.db.service.update({
          where: { id },
          data: {
            url: url ?? "",
            name: name ?? "",
          },
        })
      },
    })
  },
})
