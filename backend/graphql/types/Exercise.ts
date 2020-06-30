import { arg } from "@nexus/schema"
import { schema } from "nexus"

schema.objectType({
  name: "exercise",
  definition(t) {
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.created_at()
    t.model.custom_id()
    t.model.deleted()
    t.model.max_points()
    t.model.name()
    t.model.part()
    t.model.section()
    t.model.service_id()
    t.model.service()
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
      resolve: async (parent, args, ctx: NexusContext) => {
        const { orderBy } = args

        return ctx.db.exercise
          .findOne({ where: { id: parent.id } })
          .exercise_completion({
            where: {
              // @ts-ignore: context typing problem, FIXME
              user_id: ctx?.user?.id, // { id: ctx?.user?.id },
            },
            orderBy: orderBy ?? undefined,
          })
      },
    })
  },
})
