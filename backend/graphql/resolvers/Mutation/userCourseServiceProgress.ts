import { arg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseServiceProgress", {
      type: "user_course_service_progress",
      args: {
        progress: arg({ type: "PointsByGroup", required: true }),
        service_id: idArg({ required: true }),
        user_course_progress_id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const { service_id, progress, user_course_progress_id } = args

        const course = await ctx.db.user_course_progress
          .findOne({ where: { id: user_course_progress_id } })
          .course()
        const user = await ctx.db.user_course_progress
          .findOne({ where: { id: user_course_progress_id } })
          .user()

        if (!course || !user) {
          throw new Error("course or user not found")
        }

        return ctx.db.user_course_service_progress.create({
          data: {
            course_courseTouser_course_service_progress: {
              connect: { id: course.id },
            },
            progress: progress,
            service_serviceTouser_course_service_progress: {
              connect: { id: service_id },
            },
            user_userTouser_course_service_progress: {
              connect: { id: user.id },
            },
            user_course_progress_user_course_progressTouser_course_service_progress: {
              connect: { id: user_course_progress_id },
            },
          },
        })
      },
    })
  },
})
