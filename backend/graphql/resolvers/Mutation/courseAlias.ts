import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-core"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseAlias", {
      type: "course_alias",
      args: {
        course_code: stringArg(),
        course: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_code, course } = args

        // FIXME: what to do on empty course_code?
        if (!course_code) {
          throw new UserInputError("has to have a course code")
        }

        if (!course) {
          throw new UserInputError("must provide course")
        }

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
