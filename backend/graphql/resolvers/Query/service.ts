import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

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
