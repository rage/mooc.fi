import { arg } from "@nexus/schema"
import { schema } from "nexus"

schema.objectType({
  name: "exercise",
  definition(t) {
    t.model.id()
    t.model.course({ alias: "course_id" })
    t.model.course_courseToexercise({ alias: "course" })
    t.model.created_at()
    t.model.custom_id()
    t.model.deleted()
    t.model.max_points()
    t.model.name()
    t.model.part()
    t.model.section()
    t.model.service({ alias: "service_id" })
    t.model.service_exerciseToservice({ alias: "service" })
    t.model.timestamp()
    t.model.updated_at()

    // t.prismaFields({ filter: ["exercise_completions"] })

    t.field("exercise_completions", {
      type: "exercise_completion",
      list: true,
      args: {
        orderBy: arg({
          // FIXME?
          type: "exercise_completionOrderByInput",
          required: false,
        }),
      },
      resolve: async (parent, args, ctx) => {
        const { orderBy } = args

        return ctx.db.exercise
          .findOne({ where: { id: parent.id } })
          .exercise_completion({
            where: {
              user: ctx?.user?.id, // { id: ctx?.user?.id },
            },
            orderBy: orderBy ?? undefined,
          })
      },
    })
  },
})
