import { idArg, arg, floatArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseProgress", {
      type: "user_course_progress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
        progress: arg({ type: "PointsByGroup", required: true }),
        max_points: floatArg(),
        n_points: floatArg(),
      },
      resolve: (_, args, ctx) => {
        const { user_id, course_id, progress, max_points, n_points } = args

        return ctx.db.user_course_progress.create({
          data: {
            user: { connect: { id: user_id } },
            course: { connect: { id: course_id } },
            progress,
            max_points,
            n_points,
          },
        })
      },
    })
  },
})
