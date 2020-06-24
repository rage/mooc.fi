// import { idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.exercise()
    t.crud.exercises()

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
