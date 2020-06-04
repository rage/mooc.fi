import { objectType } from "@nexus/schema"
// import { prismaObjectType } from "nexus-prisma"
import { Course } from "../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"
import { NexusGenRootTypes } from "/generated/nexus"

const Completion = objectType({
  name: "Completion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.completion_language()
    t.model.email()
    t.model.student_number()
    t.model.user_upstream_id()
    // t.model.completion_registered()
    t.model.course()
    t.model.grade()
    t.model.certificate_id()
    /*t.prismaFields([
      "id",
      "created_at",
      "updated_at",
      "completion_language",
      "email",
      "student_number",
      "user_upstream_id",
      "completions_registered",
      "course",
      "grade",
      "certificate_id",
    ])*/
    // we're not querying completion course languages for now, and this was buggy
    /*     t.field("course", {
      type: "Course",
      args: {
        language: stringArg({ required: false }),
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
 */
    t.field("user", {
      type: "User",
      resolve: async (parent, _, ctx) => {
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
        resolve: async (parent, _, ctx) => {
          const course: Course = await ctx.prisma
            .completion({ id: parent.id })
            .course()

          let filter
          if (
            !parent.completion_language ||
            parent.completion_language === "unknown"
          ) {
            filter = {
              course: course,
            }
          } else {
            filter = {
              course: course,
              language: parent.completion_language,
            }
          }
          const avoinLinks = await ctx.prisma.openUniversityRegistrationLinks({
            where: filter,
          })
          if (avoinLinks.length < 1) {
            return null
          }
          return avoinLinks[0].link as NexusGenRootTypes["String"]
        },
      })
  },
})
export default Completion
