import {
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"
import { filterNullFields } from "../util"

export const CourseTranslation = objectType({
  name: "CourseTranslation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.instructions()
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
    t.string("link")
    t.id("course")
    t.string("instructions")
  },
})

export const CourseTranslationUpsertInput = inputObjectType({
  name: "CourseTranslationUpsertInput",
  definition(t) {
    t.id("id")
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.nonNull.string("description")
    t.string("link")
    t.id("course")
    t.string("instructions")
  },
})

export const CourseTranslationQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("courseTranslations", {
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
        instructions: stringArg(),
        link: stringArg(),
        course: idArg({ description: "course id" }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { language, name, description, instructions, link, course } = args

        const newCourseTranslation = await ctx.prisma.courseTranslation.create({
          data: {
            language,
            name: name ?? "",
            description: description ?? "",
            instructions: instructions ?? "",
            link,
            ...(course && { course: { connect: { id: course } } }),
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
        instructions: stringArg(),
        link: stringArg(),
        course: idArg({ description: "course id" }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { id, language, name, description, instructions, link, course } =
          args

        return ctx.prisma.courseTranslation.update({
          where: { id },
          data: {
            language,
            link,
            ...(course && { course: { connect: { id: course } } }),
            ...filterNullFields({
              name,
              description,
              instructions,
            }),
          },
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
