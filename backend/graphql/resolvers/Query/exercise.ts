// import { idArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.exercise({
      authorize: isAdmin,
    })
    t.crud.exercises({
      authorize: isAdmin,
    })

    /*t.field("exercise", {
      type: "exercise",
      args: {
        id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        checkAccess(ctx)
        const { id } = args
  
        const exercise = await ctx.db.exercise.findOne({
          where: { id }
        })
  
        return exercise
      },
    })

    t.list.field("exercises", {
      type: "exercise",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.exercise.findMany()
      },
    })*/
  },
})
