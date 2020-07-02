import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseTranslation", {
      type: "CourseTranslation",
      args: {
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { language, name, description, link, course } = args

        const newCourseTranslation = await ctx.db.courseTranslation.create({
          data: {
            language: language,
            name: name ?? "",
            description: description ?? "",
            link,
            course: course ? { connect: { id: course } } : undefined,
          },
        })
        return newCourseTranslation
      },
    })

    t.field("updateCourseTranslation", {
      type: "CourseTranslation",
      args: {
        id: idArg({ required: true }),
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { id, language, name, description, link, course } = args

        return ctx.db.courseTranslation.update({
          where: { id },
          data: {
            language: language,
            name: name ?? undefined,
            description: description ?? undefined,
            link: link,
            course: course ? { connect: { id: course } } : undefined,
          },
        })
      },
    })

    t.field("deleteCourseTranslation", {
      type: "CourseTranslation",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) => {
        return ctx.db.courseTranslation.delete({
          where: { id },
        })
      },
    })
  },
})
