import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseTranslation", {
      type: "course_translation",
      args: {
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { language, name, description, link, course } = args

        const newCourseTranslation = await ctx.db.course_translation.create({
          data: {
            language: language,
            name: name ?? "",
            description: description ?? "",
            link: link,
            course_courseTocourse_translation: course
              ? { connect: { id: course } }
              : undefined,
          },
        })
        return newCourseTranslation
      },
    })

    t.field("updateCourseTranslation", {
      type: "course_translation",
      args: {
        id: idArg({ required: true }),
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      resolve: (_, args, ctx) => {
        const { id, language, name, description, link, course } = args

        return ctx.db.course_translation.update({
          where: { id },
          data: {
            language: language,
            name: name ?? undefined,
            description: description ?? undefined,
            link: link,
            course_courseTocourse_translation: course
              ? { connect: { id: course } }
              : undefined,
          },
        })
      },
    })

    t.field("deleteCourseTranslation", {
      type: "course_translation",
      args: {
        id: idArg({ required: true }),
      },
      resolve: (_, args, ctx) => {
        const { id } = args

        return ctx.db.course_translation.delete({
          where: { id },
        })
      },
    })
  },
})
