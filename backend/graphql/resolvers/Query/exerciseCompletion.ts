import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.exerciseCompletion({
      authorize: isAdmin,
    })
    t.crud.exerciseCompletions({
      ordering: true,
      authorize: isAdmin,
    })

    /*t.field("exerciseCompletion", {
      type: "exercise_completion",
      args: {
        id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        checkAccess(ctx)
        const { id } = args
  
        const completion = await ctx.db.exercise_completion.findOne({
          where: { id },
        })
  
        return completion
      },
    })

    t.list.field("exerciseCompletions", {
      type: "exercise_completion",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.exercise_completion.findMany()
      },
    })*/
  },
})
