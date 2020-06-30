import { stringArg, intArg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addExercise", {
      type: "exercise",
      args: {
        custom_id: stringArg(),
        name: stringArg(),
        part: intArg(),
        section: intArg(),
        max_points: intArg(),
        course: idArg(),
        service: idArg(),
      },
      resolve: (_, args, ctx) => {
        const {
          custom_id,
          name,
          part,
          section,
          max_points,
          course,
          service,
        } = args

        ctx.db
        return ctx.db.exercise.create({
          data: {
            course: course ? { connect: { id: course } } : undefined,
            service: service ? { connect: { id: service } } : undefined,
            custom_id: custom_id ?? "",
            name,
            max_points,
            part,
            section,
          },
        })
      },
    })
  },
})
