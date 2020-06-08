// import { prismaObjectType } from "nexus-prisma"
// import { arg } from "nexus/dist"
import { objectType, arg } from "@nexus/schema"

const Exercise = objectType({
  name: "exercise",
  definition(t) {
    t.model.id()
    t.model.course()
    t.model.created_at()
    t.model.custom_id()
    t.model.deleted()
    t.model.max_points()
    t.model.name()
    t.model.part()
    t.model.section()
    t.model.service()
    t.model.timestamp()
    t.model.updated_at()

    // t.prismaFields({ filter: ["exercise_completions"] })

    t.field("exercise_completions", {
      type: "exercise_completion",
      list: true,
      args: {
        orderBy: arg({
          type: "ExerciseCompletionOrderByInput",
          required: false,
        }),
      },
      resolve: async (parent, args, ctx) => {
        const { orderBy } = args

        return ctx.prisma.exercise({ id: parent.id }).exercise_completions({
          where: {
            user: { id: ctx?.user?.id },
          },
          orderBy,
        })
      },
    })
  },
})

export default Exercise
