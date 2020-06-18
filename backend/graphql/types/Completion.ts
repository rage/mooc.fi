// import { prismaObjectType } from "nexus-prisma"
import { ForbiddenError } from "apollo-server-errors"
import { schema } from "nexus"

schema.objectType({
  name: "completion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion_language()
    t.model.email()
    t.model.student_number()
    t.model.user_upstream_id()
    t.model.completion_registered()
    t.model.course({ alias: "course_id" })
    t.model.grade()
    t.model.certificate_id()
    t.model.course_completionTocourse({ alias: "course" })
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
      type: "user",
      resolve: async (parent, _, ctx) => {
        if (ctx.disableRelations) {
          throw new ForbiddenError(
            "Cannot query relations when asking for more than 50 objects",
          )
        }
        return ctx.db.completion
          .findOne({ where: { id: parent.id } })
          .user_completionTouser()
      },
    })

    t.field("completion_link", {
      type: "String",
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const course = await ctx.db.completion
          .findOne({ where: { id: parent.id } })
          .course_completionTocourse()

        if (!course) {
          throw new Error("course not found")
        }

        let filter
        if (
          !parent.completion_language ||
          parent.completion_language === "unknown"
        ) {
          filter = {
            course: course.id,
          }
        } else {
          filter = {
            course: course.id,
            language: parent.completion_language,
          }
        }
        const avoinLinks = await ctx.db.open_university_registration_link.findMany(
          {
            where: filter,
          },
        )
        if (avoinLinks.length < 1) {
          return null
        }
        return avoinLinks[0].link
      },
    })
  },
})
