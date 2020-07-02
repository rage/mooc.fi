import { schema } from "nexus"

schema.objectType({
  name: "UserCourseServiceProgress",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    // t.model.progress()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.user_course_progress_id()
    t.model.user_course_progress()
    t.model.course_id()
    t.model.course()

    t.list.field("progress", {
      type: "Json",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.db.userCourseServiceProgress.findOne({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // errors without any typing - JSON value thing
      },
    })
  },
})
