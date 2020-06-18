import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "course_alias",
      args: {
        course_code: stringArg({ required: true }),
        course: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?

        const newCourseAlias = await ctx.db.course_alias.create({
          data: {
            course_code: course_code ?? "",
            course_courseTocourse_alias: { connect: { id: course } },
          },
        })
        return newCourseAlias
      },
    })
  },
})
