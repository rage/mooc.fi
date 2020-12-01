import {
  objectType,
  inputObjectType,
  extendType,
  stringArg,
  idArg,
  nonNull,
} from "@nexus/schema"
import { isAdmin } from "../accessControl"
import { convertUpdate } from "../util/db-functions"

export const CourseTranslation = objectType({
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

export const CourseTranslationCreateInput = inputObjectType({
  name: "CourseTranslationCreateInput",
  definition(t) {
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.nonNull.string("description")
    t.nullable.string("link")
    t.nullable.id("course")
  },
})

export const CourseTranslationUpsertInput = inputObjectType({
  name: "CourseTranslationUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.nonNull.string("description")
    t.nullable.string("link")
    t.nullable.id("course")
  },
})

export const CourseTranslationQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.field("CourseTranslations", {
      type: "CourseTranslation",
      args: {
        language: stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, { language }, ctx) =>
        ctx.prisma.courseTranslation.findMany({
          where: { language: language ?? undefined },
        }),
    })
  },
})

export const CourseTranslationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseTranslation", {
      type: "CourseTranslation",
      args: {
        language: nonNull(stringArg()),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { language, name, description, link, course } = args

        const newCourseTranslation = await ctx.prisma.courseTranslation.create({
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
        id: nonNull(idArg()),
        language: nonNull(stringArg()),
        name: stringArg(),
        description: stringArg(),
        link: stringArg(),
        course: idArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { id, language, name, description, link, course } = args

        return ctx.prisma.courseTranslation.update({
          where: { id },
          data: convertUpdate({
            language: language,
            name: name ?? undefined,
            description: description ?? undefined,
            link: link,
            course: course ? { connect: { id: course } } : undefined,
          }),
        })
      },
    })

    t.field("deleteCourseTranslation", {
      type: "CourseTranslation",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.courseTranslation.delete({
          where: { id },
        })
      },
    })
  },
})
