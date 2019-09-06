import { prismaObjectType } from "nexus-prisma"
import { Course } from "../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"
import { stringArg } from "nexus/dist"

const Completion = prismaObjectType({
  name: "Completion",
  definition(t) {
    t.prismaFields([
      "id",
      "created_at",
      "updated_at",
      "completion_language",
      "email",
      "student_number",
      "user_upstream_id",
      "completions_registered",
    ])
    t.field("course", {
      type: "Course",
      args: {
        language: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { language } = args
        const { prisma } = ctx

        const course = await prisma.course({ id: parent.course })

        if (language) {
          const course_translations = await prisma.courseTranslations({
            where: { course, language },
          })

          if (!course_translations.length) {
            return course
          }

          const { name = course.name, description } = course_translations[0]

          return { ...course, name, description }
        }

        return course
      },
    })

    t.field("user", {
      type: "User",
      resolve: async (parent, args, ctx) => {
        if (ctx.disableRelations) {
          throw new ForbiddenError(
            "Cannot query relations when asking for more than 50 objects",
          )
        }
        return ctx.prisma.completion({ id: parent.id }).user()
      },
    }),
      t.field("completion_link", {
        type: "String",
        nullable: true,
        resolve: async (parent, args, ctx) => {
          const course: Course = await ctx.prisma
            .completion({ id: parent.id })
            .course()
          const avoinLinks = await ctx.prisma.openUniversityRegistrationLinks({
            where: {
              course: course,
              language: parent.completion_language,
            },
          })
          if (avoinLinks.length < 1) return null
          return avoinLinks[0].link
        },
      })
  },
})
export default Completion
