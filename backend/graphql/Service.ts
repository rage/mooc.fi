import { schema } from "nexus"
import { stringArg, idArg } from "@nexus/schema"
import { isAdmin } from "../accessControl"

schema.objectType({
  name: "Service",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.url()
    t.model.exercise()
    t.model.user_course_service_progress()
    t.model.course()
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.service({
      authorize: isAdmin,
    })
    t.crud.services({
      pagination: false,
      authorize: isAdmin,
    })

    /*t.field("service", {
      type: "service",
      args: {
        service_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        checkAccess(ctx)
        const { service_id } = args
  
        const service = await ctx.db.service.findOne({ where: { id: service_id } })
  
        return service
      },
    })

    t.list.field("services", {
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
        url: stringArg({ required: true }),
        name: stringArg({ required: true }),
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
        id: idArg({ required: true }),
        url: stringArg(),
        name: stringArg(),
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
