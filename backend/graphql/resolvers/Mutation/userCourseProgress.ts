import { idArg, arg, floatArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
        progress: arg({ type: "PointsByGroup", required: true }),
        max_points: floatArg(),
        n_points: floatArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { user_id, course_id, progress, max_points, n_points } = args

        return ctx.db.userCourseProgress.create({
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
