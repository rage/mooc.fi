import { schema } from "nexus"

import { isAdmin } from "../accessControl"

schema.objectType({
  name: "CourseTranslation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.language()
    t.model.link()
    t.model.name()
  },
})

schema.inputObjectType({
  name: "CourseTranslationCreateInput",
  definition(t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})

schema.inputObjectType({
  name: "CourseTranslationUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.string("link", { required: false })
    t.id("course", { required: false })
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("CourseTranslations", {
      type: "CourseTranslation",
      args: {
        language: schema.stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, { language }, ctx) =>
        ctx.db.courseTranslation.findMany({
          where: { language: language ?? undefined },
        }),
    })
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseTranslation", {
      type: "CourseTranslation",
      args: {
        language: schema.stringArg({ required: true }),
        name: schema.stringArg(),
        description: schema.stringArg(),
        link: schema.stringArg(),
        course: schema.idArg(),
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
        id: schema.idArg({ required: true }),
        language: schema.stringArg({ required: true }),
        name: schema.stringArg(),
        description: schema.stringArg(),
        link: schema.stringArg(),
        course: schema.idArg(),
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
        id: schema.idArg({ required: true }),
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
