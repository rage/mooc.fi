import { prismaObjectType } from "nexus-prisma"
import { arg } from "nexus/dist"

const Exercise = prismaObjectType<"Exercise">({
  name: "Exercise",
  definition(t) {
    t.prismaFields({ filter: ["exercise_completions"] })

    t.field("exercise_completions", {
      type: "ExerciseCompletion",
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
