import { stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addService", {
      type: "service",
      args: {
        url: stringArg({ required: true }),
        name: stringArg({ required: true }),
      },
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
      type: "service",
      args: {
        id: idArg({ required: true }),
        url: stringArg(),
        name: stringArg(),
      },
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
