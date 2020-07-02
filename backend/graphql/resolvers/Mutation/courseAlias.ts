import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: stringArg({ required: true }),
        course: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?

        const newCourseAlias = await ctx.db.courseAlias.create({
          data: {
            course_code: course_code ?? "",
            course: { connect: { id: course } },
          },
        })
        return newCourseAlias
      },
    })
  },
})
