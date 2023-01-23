import {
  booleanArg,
  extendType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { Prisma, Tag } from "@prisma/client"

import { isAdmin, Role } from "../accessControl"
import { GraphQLForbiddenError, GraphQLUserInputError } from "../lib/errors"

export const CourseTag = objectType({
  name: "CourseTag",
  definition(t) {
    t.model.course_id()
    t.model.tag_id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course()

    t.field("tag", {
      type: "Tag",
      // @ts-ignore: language exists
      resolve: async ({ language, tag_id }, _args, ctx) => {
        const tag = await ctx.prisma.tag.findUnique({
          where: { id: tag_id },
        })

        return { ...tag, language } as Tag
      },
    })
    t.string("language") // passed down
  },
})

export const CourseTagCreateOrUpsertInput = inputObjectType({
  name: "CourseTagCreateOrUpsertInput",
  definition(t) {
    t.nonNull.id("course_id")
    t.nonNull.id("tag_id")
    t.field("tag", {
      type: "TagUpsertInput",
    })
  },
})

export const CourseTagCreateOrUpsertWithoutCourseIdInput = inputObjectType({
  name: "CourseTagCreateOrUpsertWithoutCourseIdInput",
  definition(t) {
    t.nonNull.id("tag_id")
    t.field("tag", {
      type: "TagUpsertInput",
    })
  },
})

export const CourseTagQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("courseTags", {
      type: "CourseTag",
      args: {
        course_id: idArg(),
        course_slug: stringArg(),
        tag_types: list(nonNull(stringArg())),
        tag_id: idArg(),
        language: stringArg(),
        includeHidden: booleanArg(),
      },
      validate: (_, { course_id, course_slug, includeHidden }, ctx) => {
        if (course_id && course_slug) {
          throw new GraphQLUserInputError(
            "provide only one of course_id or course_slug",
          )
        }
        if (includeHidden && ctx.role !== Role.ADMIN) {
          throw new GraphQLForbiddenError("admins only")
        }
      },
      resolve: async (
        _,
        { course_id, course_slug, tag_id, language, tag_types, includeHidden },
        ctx,
      ) => {
        let _course_id = course_id

        if (course_slug) {
          const course = await ctx.prisma.course.findUnique({
            where: { slug: course_slug },
          })
          _course_id = course?.id
        }

        const where = {
          course_id: _course_id ?? undefined,
          tag_id: tag_id ?? undefined,
        } as Prisma.CourseTagWhereInput

        if (language) {
          where.tag = {
            tag_translations: {
              some: {
                language,
              },
            },
          }
        }
        if (tag_types?.length) {
          where.tag = {
            ...where.tag,
            tag_types: {
              some: {
                name: {
                  in: tag_types,
                },
              },
            },
          } as Prisma.TagWhereInput
        }
        if (!includeHidden) {
          where.tag = {
            ...where.tag,
            OR: [{ hidden: false }, { hidden: null }],
          } as Prisma.TagWhereInput
        }

        const res = await ctx.prisma.courseTag.findMany({
          where,
        })

        return res.map((courseTag) => ({ ...courseTag, language }))
      },
    })
  },
})

export const CourseTagMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addCourseTag", {
      type: "CourseTag",
      args: {
        course_id: idArg(),
        course_slug: stringArg(),
        tag_id: idArg(),
        tag_name: stringArg(),
      },
      authorize: isAdmin,
      validate: (_, { course_id, course_slug, tag_id, tag_name }) => {
        if (course_id && course_slug) {
          throw new GraphQLUserInputError(
            "provide only one of course_id or course_slug",
          )
        }
        if (tag_id && tag_name) {
          throw new GraphQLUserInputError(
            "provide only one of tag_id or tag_name",
          )
        }
        if (!tag_id && !tag_name) {
          throw new GraphQLUserInputError("provide either tag_id or tag_name")
        }
      },
      resolve: async (_, { course_id, course_slug, tag_id, tag_name }, ctx) => {
        let _course_id = course_id

        if (course_slug) {
          const course = await ctx.prisma.course.findUnique({
            where: { slug: course_slug },
          })
          _course_id = course?.id
        }
        if (!_course_id) {
          throw new GraphQLUserInputError("course not found")
        }

        let _tag_id = tag_id

        if (tag_name) {
          const tag = await ctx.prisma.tag.findFirst({
            where: {
              tag_translations: {
                some: {
                  name: tag_name,
                },
              },
            },
          })
          _tag_id = tag?.id
        }

        if (!_tag_id) {
          throw new GraphQLUserInputError("tag not found")
        }

        return ctx.prisma.courseTag.create({
          data: {
            course_id: _course_id,
            tag_id: _tag_id,
          },
        })
      },
    })

    t.nonNull.field("deleteCourseTag", {
      type: "CourseTag",
      args: {
        course_id: nonNull(idArg()),
        tag_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, tag_id }, ctx) => {
        return ctx.prisma.courseTag.delete({
          where: {
            course_id_tag_id: {
              course_id,
              tag_id,
            },
          },
        })
      },
    })
  },
})
